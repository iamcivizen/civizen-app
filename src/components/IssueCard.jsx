import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { CATEGORIES, STATUS_CONFIG, PRIORITY_CONFIG } from '../data/categories.js';
import './IssueCard.css';

export default function IssueCard({ issue, compact = false }) {
  const { state, dispatch } = useApp();
  const { userVotes } = state;
  const t = useTranslation();

  const category = CATEGORIES.find(c => c.id === issue.category);
  const status = STATUS_CONFIG[issue.status];
  const hasVoted = userVotes.has(issue.id);

  const handleVote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'UPVOTE_ISSUE', payload: issue.id });
  };

  const timeAgo = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <Link to={`/issue/${issue.id}`} className="issue-card-link">
      <article className={`issue-card ${compact ? 'compact' : ''}`}>
        {/* Priority strip */}
        <div
          className="priority-strip"
          style={{ background: PRIORITY_CONFIG[issue.priority]?.color || '#64748b' }}
        />

        <div className="issue-card-inner">
          {/* Header */}
          <div className="issue-card-header">
            <div className="issue-category-tag" style={{ color: category?.color, background: `${category?.color}18` }}>
              <span>{category?.icon}</span>
              <span>{t(category?.label)}</span>
              {issue.subcategory && <span className="text-muted">· {t(issue.subcategory)}</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              {issue.reportedBy === 'cu1' && (
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)', border: '1px solid rgba(139, 92, 246, 0.25)', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                  👤 {t("Reported by You")}
                </span>
              )}
              <span className={`badge badge-${issue.status}`}>
                {status?.icon} {t(status?.label)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="issue-card-title">{issue.title}</h3>

          {/* Description (non-compact) */}
          {!compact && (
            <p className="issue-card-desc">{issue.description}</p>
          )}

          {/* Location */}
          <div className="issue-card-location">
            <span>📍</span>
            <span className="truncate">{issue.location}</span>
          </div>

          {/* Tags */}
          {!compact && issue.tags?.length > 0 && (
            <div className="issue-tags">
              {issue.tags.slice(0, 4).map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="issue-card-footer">
            <div className="issue-meta">
              <span className="text-muted text-xs">🕐 {timeAgo(issue.reportedAt)}</span>
              {issue.aiConfidence && (
                <span className="ai-confidence text-xs">
                  🤖 AI {Math.round(issue.aiConfidence * 100)}%
                </span>
              )}
            </div>

            <div className="issue-actions">
              <span className="issue-comments text-xs text-muted">
                💬 {issue.comments?.length || 0}
              </span>
              <button
                className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                onClick={handleVote}
                title={hasVoted ? 'Already upvoted' : 'Upvote this issue'}
              >
                <span>▲</span>
                <span className="vote-count">{issue.votes}</span>
              </button>
            </div>
          </div>

          {/* Resolution progress for in-progress issues */}
          {issue.status === 'in_progress' && !compact && (
            <div className="issue-progress">
              <div className="flex justify-between text-xs text-muted mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {t("Resolution Progress")}
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    ✅ {t("Verified")}
                  </span>
                </span>
                <span>{issue.timeline.length > 2 ? '60%' : '30%'}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: issue.timeline.length > 2 ? '60%' : '30%' }}
                />
              </div>
            </div>
          )}

          {/* Resolved banner */}
          {issue.status === 'resolved' && (
            <div className="resolved-banner">
              ✅ Resolved · Community effort successful!
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
