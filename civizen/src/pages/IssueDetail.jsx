import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG } from '../data/categories.js';
import './IssueDetail.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MOCK_USER_NAMES = {
  u1: { name: 'Priya Sharma', avatar: '👩' },
  u2: { name: 'Rahul Verma', avatar: '👨' },
  u3: { name: 'Anita Nair', avatar: '🧑' },
  u4: { name: 'Vikram Patel', avatar: '👦' },
  u5: { name: 'Meena Krishnan', avatar: '👧' },
  u6: { name: 'Arjun Singh', avatar: '🧔' },
  u7: { name: 'Sunita Reddy', avatar: '👱' },
  u8: { name: 'Karan Mehta', avatar: '🧑‍🦱' },
  cu1: { name: 'You (Hero)', avatar: '🦸' },
};

export default function IssueDetail() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const t = useTranslation();
  const { issues, userVotes, currentUser } = state;

  const issue = issues.find(i => i.id === id);
  const [comment, setComment] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [simulateWorker, setSimulateWorker] = useState(false);

  if (!issue) {
    return (
      <div className="page-container">
        <div className="empty-state" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <h2 style={{ margin: '1rem 0 0.5rem' }}>Issue Not Found</h2>
          <p className="text-muted">This issue may have been removed or the link is invalid.</p>
          <Link to="/tracker" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>← Back to Tracker</Link>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === issue.category);
  const status = STATUS_CONFIG[issue.status];
  const hasVoted = userVotes.has(issue.id);
  const reporter = MOCK_USER_NAMES[issue.reportedBy] || { name: 'Community Member', avatar: '👤' };

  const handleVote = () => {
    dispatch({ type: 'UPVOTE_ISSUE', payload: issue.id });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        issueId: issue.id,
        comment: {
          id: `c${Date.now()}`,
          user: 'cu1',
          text: comment,
          time: new Date().toISOString()
        }
      }
    });
    setComment('');
  };

  const handleStatusUpdate = () => {
    if (!statusUpdate) return;
    if (statusUpdate === 'resolved') {
      setIsAuditing(true);
      setTimeout(() => {
        dispatch({ type: 'UPDATE_ISSUE_STATUS', payload: { id: issue.id, status: 'resolved', note: 'Resolved by creator & verified by AI Audit' } });
        setIsAuditing(false);
        setStatusUpdate('');
      }, 1500);
    } else {
      dispatch({ type: 'UPDATE_ISSUE_STATUS', payload: { id: issue.id, status: statusUpdate } });
      setStatusUpdate('');
    }
  };

  const timeAgo = (d) => { try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return ''; } };
  const formatDate = (d) => { try { return format(new Date(d), 'MMM d, yyyy HH:mm'); } catch { return ''; } };

  return (
    <div className="page-container issue-detail-page">
      {/* Back */}
      <div className="detail-nav">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>{t("Back")}</button>
        <div className="detail-breadcrumb text-muted text-sm">
          {t("Issues")} / {t(category?.label)} / {issue.id}
        </div>
      </div>

      <div className="detail-layout">
        {/* Main Content */}
        <main className="detail-main">
          {/* Header Card */}
          <div className="detail-header-card">
            <div className="detail-header-top">
              <div className="detail-category-badge" style={{ color: category?.color, background: `${category?.color}18` }}>
                {category?.icon} {t(category?.label)} · {t(issue.subcategory)}
              </div>
              <div className="detail-status-badges">
                <span className={`badge badge-${issue.status}`}>{status?.icon} {t(status?.label)}</span>
                <span className="badge" style={{ color: PRIORITY_CONFIG[issue.priority]?.color, background: `${PRIORITY_CONFIG[issue.priority]?.color}18`, border: `1px solid ${PRIORITY_CONFIG[issue.priority]?.color}40` }}>
                  ⚠️ {t(PRIORITY_CONFIG[issue.priority]?.label)}
                </span>
              </div>
            </div>

            <h1 className="detail-title">{issue.title}</h1>

            <div className="detail-meta-row">
              <div className="reporter-info">
                <span className="reporter-avatar">{reporter.avatar}</span>
                <div>
                  <div className="reporter-name text-sm font-semibold">{reporter.name}</div>
                  <div className="reporter-time text-xs text-muted">{timeAgo(issue.reportedAt)}</div>
                </div>
              </div>
              <div className="detail-meta-right">
                <div className="text-xs text-muted">🤖 AI Confidence: <strong>{Math.round((issue.aiConfidence || 0.75) * 100)}%</strong></div>
                <div className="text-xs text-muted">📍 {issue.ward}</div>
              </div>
            </div>

            <p className="detail-description">{issue.description}</p>

            {/* Images Gallery */}
            {issue.images && issue.images.length > 0 && (
              <div className={`detail-gallery ${issue.images.length === 1 ? 'single-image' : ''}`}>
                {issue.images.map((img, index) => (
                  <div key={index} className="gallery-item">
                    <img src={img} alt={`Issue attachment ${index + 1}`} className="gallery-img" />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {issue.tags?.length > 0 && (
              <div className="detail-tags">
                {issue.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions-bar">
              <button
                id="detail-vote-btn"
                className={`vote-large-btn ${hasVoted ? 'voted' : ''}`}
                onClick={handleVote}
              >
                <span>▲</span>
                <span>{issue.votes} {t("Upvotes")}</span>
              </button>
              <div className="text-sm text-muted">💬 {issue.comments?.length} {t("comments")}</div>
              <div className="text-sm text-muted">⏱️ {t("Dept")}: {t(issue.department)}</div>
            </div>

            {/* Verification Widget */}
            <div className="verification-widget">
              <div className="verification-widget-inner">
                <div>
                  <h4 className="verification-title">
                    <span>🛡️ {t("Civic Verification")}</span>
                    <span className="verification-sub">
                      ({t("Requires 3 verifications to validate")})
                    </span>
                  </h4>
                  <p className="verification-desc-text">
                    {issue.status === 'reported' ? (
                      t("Currently verified by {count} citizens. Original reporter receives +100 points only upon verification.").replace('{count}', (issue.verifiedBy || []).length)
                    ) : issue.status === 'in_progress' ? (
                      t("Verified progress: {count} citizens confirmed BBMP worker activity.").replace('{count}', (issue.verifiedBy || []).length || 2)
                    ) : issue.status === 'resolved' ? (
                      `✅ ` + t("Verified resolution: {count} citizens confirmed work closure.").replace('{count}', (issue.verifiedBy || []).length || 3)
                    ) : (
                      `✅ ` + t("Verified as genuine by {count} citizens.").replace('{count}', (issue.verifiedBy || []).length || 3)
                    )}
                  </p>
                </div>
                
                {issue.status !== 'rejected' && (
                  <button
                    id="verify-btn"
                    className={`btn verify-action-btn ${issue.verifiedBy?.includes('cu1') ? 'verified' : 'verify-active'}`}
                    onClick={() => {
                      if (!issue.verifiedBy?.includes('cu1')) {
                        dispatch({ type: 'VERIFY_ISSUE', payload: { id: issue.id, userId: 'cu1' } });
                      }
                    }}
                    disabled={issue.verifiedBy?.includes('cu1')}
                  >
                    {issue.verifiedBy?.includes('cu1') ? '✓ ' + t("Verified") : (
                      issue.status === 'in_progress' ? t("Verify Progress (+25 pts)") :
                      issue.status === 'resolved' ? t("Verify Resolution (+25 pts)") :
                      t("Verify Issue (+25 pts)")
                    )}
                  </button>
                )}
              </div>
              
              {/* Progress Bar */}
              {issue.status === 'reported' && (
                <div className="progress-bar" style={{ marginTop: '0.75rem', height: '6px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, (((issue.verificationCount || 0) / 3) * 100))}%`,
                      background: 'var(--accent-secondary)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card detail-section">
            <h2 className="section-h2">📋 Resolution Timeline</h2>
            <div className="timeline">
              {issue.timeline?.map((event, i) => {
                const st = STATUS_CONFIG[event.status];
                return (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" style={{ background: st?.color || 'var(--accent-primary)' }}>
                      <span>{st?.icon || '•'}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-event-title">
                        <span className="font-semibold">{t(st?.label) || event.status}</span>
                        <span className="text-xs text-muted">{formatDate(event.time)}</span>
                      </div>
                      <div className="timeline-note text-sm text-muted">{event.note}</div>
                    </div>
                  </div>
                );
              })}
              {issue.status !== 'resolved' && (
                <div className="timeline-item pending">
                  <div className="timeline-dot pending-dot">?</div>
                  <div className="timeline-content">
                    <div className="timeline-event-title">
                      <span className="font-semibold text-muted">Awaiting Resolution</span>
                    </div>
                    <div className="text-xs text-muted">Community support helps expedite resolution</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="card detail-section">
            <h2 className="section-h2">💬 Community Comments ({issue.comments?.length})</h2>

            {issue.comments?.length === 0 && (
              <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>Be the first to comment!</p>
            )}

            <div className="comments-list">
              {issue.comments?.map(c => {
                const user = MOCK_USER_NAMES[c.user] || { name: 'Community Member', avatar: '👤' };
                return (
                  <div key={c.id} className="comment-item">
                    <div className="comment-avatar">{user.avatar}</div>
                    <div className="comment-body">
                      <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className="comment-user font-semibold text-sm">{user.name}</span>
                          <span className="comment-time text-xs text-muted" style={{ marginLeft: '0.5rem' }}>
                            {formatDate(c.time)} ({timeAgo(c.time)})
                          </span>
                          {c.editedAt && (
                            <span className="comment-time text-xs" style={{ color: 'var(--accent-secondary)', marginLeft: '0.5rem' }}>
                              (Edited: {formatDate(c.editedAt)})
                            </span>
                          )}
                        </div>
                        {editingCommentId !== c.id && (
                          <button
                            onClick={() => {
                              setEditingCommentId(c.id);
                              setEditingText(c.text);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent-primary)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {editingCommentId === c.id ? (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            style={{
                              background: 'var(--bg-glass)',
                              border: '1px solid var(--border-accent)',
                              color: 'var(--text-primary)',
                              borderRadius: '6px',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.85rem',
                              width: '100%',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              if (editingText.trim()) {
                                dispatch({
                                  type: 'EDIT_COMMENT',
                                  payload: { issueId: issue.id, commentId: c.id, text: editingText }
                                });
                                setEditingCommentId(null);
                              }
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="comment-text text-sm" style={{ marginTop: '0.25rem' }}>{c.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comment Form */}
            <form className="comment-form" onSubmit={handleComment}>
              <div className="comment-input-wrap">
                <span className="comment-self-avatar">{currentUser.avatar}</span>
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input-field"
                  id="comment-input"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!comment.trim()}
                id="submit-comment-btn"
              >
                Post →
              </button>
            </form>
          </div>

          {/* AI Zonal Dispatcher & SLA Escalator (Horizontal Layout in Main Column) - Sleek Compact Layout */}
          <div className="card detail-section ai-dispatcher-card" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', padding: '1rem', borderRadius: '12px', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.65rem', marginBottom: '0.85rem' }}>
              <div>
                <h2 className="section-h2" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                  <span>🤖</span> {t("Autonomous AI Dispatcher Agent")}
                </h2>
                <p className="text-xxs text-muted" style={{ margin: '0.15rem 0 0 0' }}>
                  {t("Orchestrating civic routing, scheduling coordination, and crowdsourced audit alerts.")}
                </p>
              </div>
              <span className="badge badge-resolved" style={{ background: 'rgba(6, 214, 160, 0.12)', color: '#06d6a0', fontWeight: 800, padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                ● {t("Active Agent Feed")}
              </span>
            </div>

            {/* Horizontal workflow rows for each capability to eliminate side empty whitespace */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              
              {/* Box 1: AI Smart Dispatch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', padding: '0.65rem 0.85rem', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: '#3b82f6', fontSize: '0.95rem', fontWeight: 800 }}>✓</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t("1. AI Smart Dispatch")}</strong>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {t("Automatically parses report keywords/photos using NLP and dispatches to the exact responsible civic department.")}
                  </p>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.06)', padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', color: '#60a5fa', fontFamily: 'monospace', minWidth: '200px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                  {t("Routed to")}: {t(issue.department)} (Docket: UP-{issue.id.toUpperCase()})
                </div>
              </div>

              {/* Box 2: Joint-Agency Work Sync */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', padding: '0.65rem 0.85rem', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: '#3b82f6', fontSize: '0.95rem', fontWeight: 800 }}>✓</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t("2. Joint-Agency Sync")}</strong>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {t("Scans municipal databases to align schedules (e.g., matching cable laying and repaving) to avoid repeated road cutting.")}
                  </p>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.06)', padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', color: '#60a5fa', minWidth: '200px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                  📅 {t("Status")}: {t("Excavation & Repaving aligned.")}
                </div>
              </div>

              {/* Box 3: Community Volunteer Alert */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', padding: '0.65rem 0.85rem', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: 'var(--accent-purple)', fontSize: '0.95rem' }}>●</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t("3. Volunteer Alert")}</strong>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {t("Pings registered local active citizens in a 500m radius to crowd-verify reported resolution status.")}
                  </p>
                </div>
                <div style={{ background: 'rgba(139, 92, 246, 0.06)', padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--accent-purple)', minWidth: '200px', textAlign: 'center', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                  🔔 {t("Notified")}: 3 {t("nearby volunteers for audit.")}
                </div>
              </div>

              {/* Box 4: SLA Auto-Escalator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', padding: '0.65rem 0.85rem', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: 'var(--accent-orange)', fontSize: '0.95rem', fontWeight: 800 }}>⚠️</span>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t("4. SLA Escalation")}</strong>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {t("Monitors response times against citizen charters. Escalates to senior directors if overdue.")}
                  </p>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--accent-orange)', minWidth: '200px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                  ⌛ {t("Target")}: {t("Escalation to Zonal Commissioner in 48h.")}
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          {/* Mini Map */}
          {issue.coordinates && (
            <div className="card detail-section">
              <h2 className="section-h2" style={{ marginBottom: '0.875rem' }}>📍 Location</h2>
              <div style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <MapContainer
                  center={issue.coordinates}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer url={state.theme === 'light' ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'} />
                  <Marker position={issue.coordinates}>
                    <Popup>{issue.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="text-sm text-muted">{issue.location}</p>
            </div>
          )}

          {/* Issue Status & Info */}
          <div className="card detail-section status-info-card">
            <h2 className="section-h2">🔧 {t("Status & Info")}</h2>
            
            <div className="status-update-section">
              {simulateWorker ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.65rem', fontWeight: 800 }}>
                      ⚠️ {t("Simulating Government Worker")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSimulateWorker(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {t("Exit Mode")}
                    </button>
                  </div>
                  {isAuditing && (
                    <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid var(--border-accent)', marginBottom: '0.75rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>🤖 AI Smart Auditor Running</span>
                      <span className="text-muted">Verifying resolution photo metadata and checking geotag coordinates...</span>
                      <div className="progress-bar" style={{ height: '4px', marginTop: '0.25rem' }}>
                        <div className="progress-bar-fill" style={{ width: '100%', background: 'var(--accent-primary)', animation: 'shimmer 1.5s infinite' }} />
                      </div>
                    </div>
                  )}
                  <select
                    id="status-update-select"
                    className="input-field"
                    value={statusUpdate}
                    onChange={e => setStatusUpdate(e.target.value)}
                    style={{ marginBottom: '0.75rem' }}
                    disabled={isAuditing}
                  >
                    <option value="">Select new status</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.label}</option>
                    ))}
                  </select>
                  <button
                    id="update-status-btn"
                    className="btn btn-primary w-full"
                    style={{ justifyContent: 'center' }}
                    onClick={handleStatusUpdate}
                    disabled={!statusUpdate || isAuditing}
                  >
                    {isAuditing ? '🤖 Auditing...' : 'Update Status'}
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', borderRadius: '12px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-purple)', fontWeight: 800, marginBottom: '0.35rem' }}>
                      <span>🔒</span> {t("Official Managed")}
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.45' }}>
                      {t("Status updates are restricted to authorized government field workers and BBMP ward officials. Issuer cannot update this directly.")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'center', fontSize: '0.725rem' }}
                    onClick={() => setSimulateWorker(true)}
                  >
                    ⚙️ {t("Simulate Ward Worker Update")}
                  </button>
                </div>
              )}
            </div>

            <div className="divider" style={{ margin: '1.25rem 0' }}></div>

            <div className="info-list">
              <div className="info-row">
                <span className="info-label">ID</span>
                <span className="info-value text-muted">{issue.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Reported</span>
                <span className="info-value">{formatDate(issue.reportedAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Updated</span>
                <span className="info-value">{formatDate(issue.updatedAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ward</span>
                <span className="info-value">{issue.ward}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department</span>
                <span className="info-value">{issue.department}</span>
              </div>
              {issue.resolvedAt && (
                <div className="info-row">
                  <span className="info-label">Resolved</span>
                  <span className="info-value" style={{ color: 'var(--accent-secondary)' }}>{formatDate(issue.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Similar Issues (Sidebar Layout) */}
          <div className="card detail-section similar-issues-section">
            <h2 className="section-h2" style={{ marginBottom: '0.85rem' }}>🔗 {t("Similar Issues")}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {issues
                .filter(i => i.id !== issue.id && i.category === issue.category)
                .slice(0, 3)
                .map(i => {
                  const cat = CATEGORIES.find(c => c.id === i.category);
                  const st = STATUS_CONFIG[i.status];
                  return (
                    <Link key={i.id} to={`/issue/${i.id}`} className="similar-issue-card" style={{ display: 'block', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', borderRadius: '10px' }}>
                      <div className="similar-issue-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span className="badge" style={{ color: cat?.color, background: `${cat?.color}18`, textTransform: 'none', padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                          {cat?.icon} {t(cat?.label)}
                        </span>
                        <span className={`badge badge-${i.status}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                          {t(st?.label)}
                        </span>
                      </div>
                      <h4 className="similar-issue-title" style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.4rem 0' }}>{i.title}</h4>
                      <div className="similar-issue-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        <span>📍 {t(i.ward)}</span>
                        <span>▲ {i.votes}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
