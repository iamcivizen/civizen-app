import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { BADGES } from '../data/categories.js';
import './Leaderboard.css';

export default function Leaderboard() {
  const { state, dispatch } = useApp();
  const { users, currentUser } = state;
  const t = useTranslation();

  const [activeTab, setActiveTab] = useState('all-time');
  const [showModal, setShowModal] = useState(!currentUser.leaderboardConsent);

  // Combine current user with mock users for display
  const allUsers = [
    ...users,
    {
      ...currentUser,
      id: 'cu1',
      rank: 9,
      issuesResolved: Math.floor(currentUser.issuesReported * 0.6),
    }
  ].sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = allUsers.slice(0, 3);
  const rest = allUsers.slice(3);

  const getLevel = (points) => {
    if (points >= 1000) return { name: 'Legend', color: '#f59e0b', icon: '👑' };
    if (points >= 750) return { name: 'Champion', color: '#8b5cf6', icon: '🏆' };
    if (points >= 500) return { name: 'Hero', color: '#4f6ef7', icon: '🦸' };
    if (points >= 250) return { name: 'Guardian', color: '#06d6a0', icon: '🛡️' };
    return { name: 'Rookie', color: '#64748b', icon: '🌱' };
  };

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);



  return (
    <div className="page-container leaderboard-page">
      <div className="page-header">
        <h1 className="page-title">{t("Community Champions Leaderboard")}</h1>
        <p className="page-subtitle">{t("Participate in community auditing, earn verified citizen points, and claim municipal rewards")}</p>
      </div>

      <div style={{ position: 'relative', width: '100%', marginTop: '2rem' }}>
          {/* Blur Overlay for Consent Opt-Out */}
          {!currentUser.leaderboardConsent && (
            <div className="lb-lock-overlay">
              <div className="lb-lock-card">
                <span className="lb-lock-icon">🔒</span>
                <h3 style={{ margin: '0.5rem 0', color: 'var(--text-primary)' }}>{t("Opt-In Required")}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {t("To view rankings and share your civic achievements with other citizens, we need your consent to display your profile name, XP points, and report count on the public leaderboard. You can opt out at any time from your profile menu.")}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => dispatch({ type: 'GRANT_LEADERBOARD_CONSENT' })}
                  >
                    🚀 {t("Agree & Join")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={!currentUser.leaderboardConsent ? 'lb-blurred-content' : ''}>
            {/* Period Tabs */}
            <div className="lb-tabs">
              {['all-time', 'this-month', 'this-week'].map(tab => (
                <button
                  key={tab}
                  id={`lb-tab-${tab}`}
                  className={`lb-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all-time' ? t('🏆 All Time / ಒಟ್ಟು') : tab === 'this-month' ? t('📅 This Month / ಈ ತಿಂಗಳು') : t('🔥 This Week / ಈ ವಾರ')}
                </button>
              ))}
            </div>

            <div className="lb-main-layout">
              {/* Left Column: Podium & Badges Section */}
              <div className="lb-left-col">
                {/* Podium */}
                <div className="podium-section">
                  <div className="podium">
                    {podiumOrder.map((user, idx) => {
                      const level = getLevel(user.points);
                      const isYou = user.id === 'cu1';
                      const actualRank = [2, 1, 3][idx];
                      const medalColors = ['#c0c0c0', '#f59e0b', '#cd7f32'];
                      const medalColors2 = ['#94a3b8', '#fbbf24', '#b45309'];
                      const heights = [80, 120, 60];

                      return (
                        <div key={user.id} className={`podium-slot ${isYou ? 'you' : ''}`} style={{ order: idx }}>
                          <div className="podium-user">
                            <div className="podium-avatar-wrap">
                              <div className="podium-avatar">{user.avatar}</div>
                              <div className="podium-crown" style={{ color: medalColors[idx] }}>
                                {actualRank === 1 ? '👑' : actualRank === 2 ? '🥈' : '🥉'}
                              </div>
                            </div>
                            <div className="podium-name">{user.name}{isYou ? ' (You)' : ''}</div>
                            <div className="podium-level" style={{ color: level.color }}>{level.icon} {level.name}</div>
                            <div className="podium-points">{user.points.toLocaleString()} pts</div>
                          </div>
                          <div
                            className="podium-base"
                            style={{
                              height: `${heights[idx]}px`,
                              background: `linear-gradient(to top, ${medalColors2[idx]}33, ${medalColors[idx]}22)`,
                              borderTop: `3px solid ${medalColors[idx]}`,
                            }}
                          >
                            <div className="podium-rank" style={{ color: medalColors[idx] }}>#{actualRank}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Badges Section */}
                <div className="badges-section">
                  <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>🎖️ Achievement Badges</h2>
                  <div className="all-badges">
                    {BADGES.map(badge => {
                      const earned = currentUser.badges?.includes(badge.id);
                      return (
                        <div key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                          <div className="badge-card-icon">{badge.icon}</div>
                          <div className="badge-card-name">{t(badge.name)}</div>
                          <div className="badge-card-desc text-xs text-muted">{t(badge.desc)}</div>
                          <div className="badge-card-points">+{badge.points} pts</div>
                          {earned ? (
                            <div className="badge-earned-label">✅ Earned!</div>
                          ) : (
                            <div className="badge-locked-label">🔒 Locked</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Rankings Table & Points Guide */}
              <div className="lb-right-col">
                {/* Rankings Table */}
                <div className="lb-table-section">
                  <div className="lb-table-header">
                    <span>Rank</span>
                    <span>Citizen</span>
                    <span>Points</span>
                    <span>Reports</span>
                    <span>Level</span>
                    <span>Badges</span>
                  </div>

                  {allUsers.map((user) => {
                    const level = getLevel(user.points);
                    const isYou = user.id === 'cu1';
                    const userBadges = BADGES.filter(b => user.badges?.includes(b.id));

                    return (
                      <div
                        key={user.id}
                        className={`lb-table-row ${isYou ? 'you-row' : ''} ${user.rank <= 3 ? 'top-3' : ''}`}
                        id={`user-row-${user.id}`}
                      >
                        <div className="rank-cell">
                          {user.rank <= 3 ? (
                            <span className="rank-medal">{['🥇', '🥈', '🥉'][user.rank - 1]}</span>
                          ) : (
                            <span className="rank-num">#{user.rank}</span>
                          )}
                        </div>

                        <div className="user-cell">
                          <div className={`user-avatar-sm ${isYou ? 'you-avatar' : ''}`}>{user.avatar}</div>
                          <div>
                            <div className="user-cell-name">
                              {user.name}
                              {isYou && <span className="you-tag">YOU</span>}
                            </div>
                            <div className="text-xs text-muted">#{user.rank} in community</div>
                          </div>
                        </div>

                        <div className="points-cell">
                          <div className="points-value">{user.points.toLocaleString()}</div>
                          <div className="progress-bar" style={{ marginTop: '4px', width: '80px' }}>
                            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (user.points / allUsers[0].points) * 100)}%` }} />
                          </div>
                        </div>

                        <div className="reports-cell">
                          <span className="text-sm font-semibold">{user.issuesReported}</span>
                          <span className="text-xs text-muted"> reports</span>
                        </div>

                        <div className="level-cell">
                          <span style={{ color: level.color, fontSize: '0.8rem', fontWeight: 700 }}>
                            {level.icon} {level.name}
                          </span>
                        </div>

                        <div className="badges-cell">
                          <div className="badges-row">
                            {userBadges.slice(0, 4).map(b => (
                              <span key={b.id} className="badge-icon" title={`${b.name}: ${b.desc}`}>
                                {b.icon}
                              </span>
                            ))}
                            {userBadges.length > 4 && (
                              <span className="text-xs text-muted">+{userBadges.length - 4}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* How Points Work */}
                <div className="points-guide">
                  <h3 className="font-semibold" style={{ marginBottom: '1rem' }}>🛡️ Anti-Spam Points Protocol</h3>
                  <p className="text-xs text-muted" style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
                    To maintain report integrity and prevent fake submissions, <strong>0 points</strong> are awarded on initial report. Points are credited only when issues are validated by community consensus or municipal officials.
                  </p>
                  <div className="points-grid">
                    <div className="points-action">
                      <span className="points-act-icon">📝</span>
                      <span className="text-sm">Report submitted</span>
                      <span className="points-act-val" style={{ color: 'var(--text-muted)' }}>+0 pts</span>
                    </div>
                    <div className="points-action">
                      <span className="points-act-icon">🛡️</span>
                      <span className="text-sm">Report verified (3 votes)</span>
                      <span className="points-act-val">+100 pts</span>
                    </div>
                    <div className="points-action">
                      <span className="points-act-icon">🕵️</span>
                      <span className="text-sm">Verify others' reports</span>
                      <span className="points-act-val">+25 pts</span>
                    </div>
                    <div className="points-action">
                      <span className="points-act-icon">▲</span>
                      <span className="text-sm">Upvote verified issue</span>
                      <span className="points-act-val">+5 pts</span>
                    </div>
                    <div className="points-action">
                      <span className="points-act-icon">✅</span>
                      <span className="text-sm">Issue gets resolved</span>
                      <span className="points-act-val">+150 pts</span>
                    </div>
                    <div className="points-action">
                      <span className="points-act-icon">💬</span>
                      <span className="text-sm">Add helpful comment</span>
                      <span className="points-act-val">+10 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Consent Popup Modal */}
      {showModal && !currentUser.leaderboardConsent && (
        <div className="lb-modal-backdrop" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(8, 12, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="lb-modal-content" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'dropdown-in 0.3s ease'
          }}>
            <div className="lb-modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-primary)',
              paddingBottom: '0.75rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏆 {t("Join Civic Leaderboard?")}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>
            <div className="lb-modal-body">
              <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {t("To view rankings and share your civic achievements with other citizens, we need your consent to display your profile name, XP points, and report count on the public leaderboard. You can opt out at any time from your profile menu.")}
              </p>
              <div style={{
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                lineHeight: '1.4'
              }}>
                ℹ️ <strong>Privacy Information:</strong> We respect your privacy. Only your avatar, screen name, active points, and report count will be shown. No personal ID or contact info is ever shared.
              </div>
            </div>
            <div className="lb-modal-footer" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              borderTop: '1px solid var(--border-primary)',
              paddingTop: '1rem',
              marginTop: '0.5rem'
            }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowModal(false)}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                {t("Decline")}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  dispatch({ type: 'GRANT_LEADERBOARD_CONSENT' });
                  setShowModal(false);
                }}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                {t("Agree & Join")}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
