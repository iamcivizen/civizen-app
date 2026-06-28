import { useState } from 'react';
import { WARD_STATS } from '../data/mockData.js';
import './WardOfficials.css';

export default function WardOfficials() {
  const [selectedWard, setSelectedWard] = useState(WARD_STATS[0].ward);

  // Find the active official based on selection
  const activeOfficial = WARD_STATS.find(w => w.ward === selectedWard) || WARD_STATS[0];

  // Sort officials by performance score for the accountability leaderboard
  const rankedOfficials = [...WARD_STATS]
    .sort((a, b) => b.score - a.score)
    .map((o, i) => ({ ...o, rank: i + 1 }));

  return (
    <div className="page-container officials-page">
      <div className="page-header">
        <h1 className="page-title">Ward Accountability Hub</h1>
        <p className="page-subtitle">Track resolved tickets, audit local ward authorities, and view response performance indexes</p>
      </div>

      <div className="officials-grid">
        {/* Left Section: Active Official Details */}
        <div className="card official-detail-card">
          <div className="card-header">
            <h3>🏛️ Ward Authority Details</h3>
            <div className="ward-selector-wrap">
              <label htmlFor="ward-select" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Select Ward:</label>
              <select
                id="ward-select"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="ward-select-dropdown"
              >
                {WARD_STATS.map(w => (
                  <option key={w.ward} value={w.ward}>{w.ward} Ward</option>
                ))}
              </select>
            </div>
          </div>

          <div className="official-profile-header">
            <div className="official-avatar-large">{activeOfficial.officialPhoto || '👨‍💼'}</div>
            <div className="official-meta">
              <h2>{activeOfficial.officialName}</h2>
              <p className="role-tag">Ward In-Charge • {activeOfficial.ward} Ward</p>
              <div className="rating-badge">
                <span className="star-icon">⭐</span>
                <span className="rating-val">{activeOfficial.officialRating} / 5.0</span>
                <span className="rating-label">Citizen Rating</span>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Performance Analytics Grid */}
          <div className="performance-metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Resolution Rate</span>
              <span className="metric-value positive">{activeOfficial.score}%</span>
              <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                <div className="progress-bar-fill" style={{ width: `${activeOfficial.score}%`, background: 'var(--accent-green)' }} />
              </div>
            </div>

            <div className="metric-box">
              <span className="metric-label">Assigned Issues</span>
              <span className="metric-value">{activeOfficial.issues}</span>
              <span className="metric-subtitle">Tickets logged</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Resolved Tickets</span>
              <span className="metric-value" style={{ color: 'var(--accent-secondary)' }}>{activeOfficial.resolved}</span>
              <span className="metric-subtitle">Completed tasks</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Average Response</span>
              <span className="metric-value" style={{ color: 'var(--accent-orange)' }}>
                {activeOfficial.ward === 'Koramangala' ? '3.1' : activeOfficial.ward === 'Indiranagar' ? '2.4' : '4.8'} days
              </span>
              <span className="metric-subtitle">Sync-to-Close rate</span>
            </div>
          </div>

          <div className="satisfaction-meter-section">
            <div className="meter-header">
              <span>Citizen Satisfaction Index</span>
              <span className="meter-val font-semibold">{activeOfficial.score + 5}%</span>
            </div>
            <div className="progress-bar" style={{ marginTop: '0.5rem', height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${activeOfficial.score + 5}%`, background: 'var(--accent-primary)' }} />
            </div>
          </div>

          <hr className="divider" />

          {/* Official Contact Info */}
          <div className="official-contact-info">
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>📬 Public Accountability Auditing</h4>
            <div className="contact-buttons">
              <a href={`mailto:${activeOfficial.email}`} className="btn btn-secondary contact-btn">
                <span>📧 Email Ward Office</span>
              </a>
              <a href={`tel:${activeOfficial.phone}`} className="btn btn-secondary contact-btn">
                <span>📞 Call Duty Officer</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Section: Ranked Accountability Leaderboard */}
        <div className="card leaderboard-card">
          <div className="card-header">
            <h3>🏆 City Ward Rankings</h3>
            <span className="badge text-xs" style={{ background: 'rgba(79,110,247,0.15)', color: '#4f6ef7' }}>Live Audits</span>
          </div>

          <div className="officials-rankings-table">
            <div className="table-header">
              <span>Rank</span>
              <span>Official / Ward</span>
              <span>Resolution Rate</span>
              <span>Rating</span>
            </div>

            <div className="table-rows-container">
              {rankedOfficials.map((off) => {
                const isSelected = off.ward === selectedWard;
                return (
                  <div
                    key={off.ward}
                    className={`table-row ${isSelected ? 'row-active' : ''}`}
                    onClick={() => setSelectedWard(off.ward)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rank-cell">
                      {off.rank <= 3 ? (
                        <span className="rank-medal">{['🥇', '🥈', '🥉'][off.rank - 1]}</span>
                      ) : (
                        <span className="rank-num">#{off.rank}</span>
                      )}
                    </div>

                    <div className="official-cell">
                      <div className="avatar-sm">{off.officialPhoto || '👨‍💼'}</div>
                      <div>
                        <div className="official-cell-name">{off.officialName}</div>
                        <div className="text-xs text-muted">{off.ward} Ward</div>
                      </div>
                    </div>

                    <div className="score-cell">
                      <div className="score-value">{off.score}%</div>
                      <div className="progress-bar" style={{ width: '60px', marginTop: '4px' }}>
                        <div className="progress-bar-fill" style={{ width: `${off.score}%`, background: 'var(--accent-green)' }} />
                      </div>
                    </div>

                    <div className="rating-cell">
                      <span className="star-icon">⭐</span>
                      <span className="text-sm font-semibold">{off.officialRating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="legal-notice">
            <p className="text-xs text-muted" style={{ textAlign: 'center', marginTop: '1.5rem', fontStyle: 'italic' }}>
              * Under Municipal Code Section 12, ward metrics are aggregated directly from verified citizen reports. Resolvers are held responsible for community status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
