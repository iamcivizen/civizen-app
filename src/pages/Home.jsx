import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import IssueCard from '../components/IssueCard.jsx';
import { CATEGORIES, STATUS_CONFIG } from '../data/categories.js';
import { PREDICTIVE_ALERTS, WARD_STATS } from '../data/mockData.js';
import { useTranslation } from '../utils/translations.js';
import './Home.css';

export default function Home() {
  const { state, dispatch } = useApp();
  const { issues, currentUser, isLoggedIn } = state;
  const t = useTranslation();

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
  const criticalIssues = issues.filter(i => i.priority === 'critical' && i.status !== 'resolved').length;

  const recentIssues = [...issues].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)).slice(0, 7);
  const trendingIssues = [...issues].sort((a, b) => b.votes - a.votes).slice(0, 3);

  const userArea = currentUser?.area || 'Koramangala';
  const activeOfficial = WARD_STATS.find(w => 
    userArea.toLowerCase().includes(w.ward.toLowerCase())
  ) || WARD_STATS[0];

  return (
    <div className="page-container home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot" style={{ width: 8, height: 8, background: 'var(--accent-secondary)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }}></span>
            &nbsp; {t("Live Community Platform")}
          </div>

          {/* Large Premium Styled Brand Logo */}
          <Link to="/" className="hero-brand" aria-label="Go to home page">
            <span className="brand-name-main">Civi</span>
            <span className="brand-name-sub">zen</span>
            <span className="brand-icon">⚡</span>
          </Link>

          <h1 className="hero-title">
            {t("Be the Change")}
          </h1>

          <p className="hero-subtitle">
            {t("Report, verify, and resolve local issues with the power of AI and community collaboration. Every report matters.")}
          </p>
          <div className="hero-actions">
            {isLoggedIn ? (
              <Link to="/report" id="hero-report-btn" className="btn btn-primary btn-lg">
                📝 {t("Report Issue")}
              </Link>
            ) : (
              <button
                id="hero-report-btn"
                className="btn btn-primary btn-lg"
                onClick={() => dispatch({ type: 'SET_LOGIN_MODAL', payload: true })}
              >
                📝 {t("Report Issue")}
              </button>
            )}
            {isLoggedIn ? (
              <Link to="/map" id="hero-map-btn" className="btn btn-secondary btn-lg">
                🗺️ {t("View Map")}
              </Link>
            ) : (
              <button
                id="hero-map-btn"
                className="btn btn-secondary btn-lg"
                onClick={() => dispatch({ type: 'SET_LOGIN_MODAL', payload: true })}
              >
                🗺️ {t("View Map")}
              </button>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
          <div className="hero-center-icon">⚡</div>
          <div className="floating-cards">
            <div className="float-card fc-1">
              <span className="fc-icon">📸</span>
              <div className="fc-details">
                <strong>{t("1. Snap & Report")}</strong>
                <span>{t("Submit geotagged photos of local issues.")}</span>
              </div>
            </div>
            <div className="float-card fc-2">
              <span className="fc-icon">🤝</span>
              <div className="fc-details">
                <strong>{t("2. Community Verify")}</strong>
                <span>{t("Neighbors vote to validate genuineness.")}</span>
              </div>
            </div>
            <div className="float-card fc-3">
              <span className="fc-icon">🛡️</span>
              <div className="fc-details">
                <strong>{t("3. Vigilant Citizen")}</strong>
                <span>{t("Earn points for genuine, verified reports.")}</span>
              </div>
            </div>
            <div className="float-card fc-4">
              <span className="fc-icon">🎟️</span>
              <div className="fc-details">
                <strong>{t("4. Redeem Subsidies")}</strong>
                <span>{t("Get UPI / BBPS bill discounts.")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {isLoggedIn && (
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{totalIssues}</div>
            <div className="stat-label">{t("Total Issues Reported")}</div>
            <div className="stat-change positive">↑ 23% this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value" style={{ background: 'var(--gradient-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {resolvedIssues}
            </div>
            <div className="stat-label">{t("Issues Resolved")}</div>
            <div className="stat-change positive">↑ {Math.round((resolvedIssues/totalIssues)*100)}% resolution rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {inProgressIssues}
            </div>
            <div className="stat-label">{t("In Progress")}</div>
            <div className="stat-change positive">Actively being fixed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {criticalIssues}
            </div>
            <div className="stat-label">{t("Critical Issues")}</div>
            <div className="stat-change negative">Need immediate attention</div>
          </div>
        </section>
      )}

      {isLoggedIn && (
        <>
          <div className="home-grid">
            {/* Main/Left Column */}
            <div className="home-main-col">
              {/* Recent Issues */}
              <section className="home-section recent-issues">
                <div className="section-header">
                  <h2 className="section-title">🕐 {t("Recent Reports")}</h2>
                  <Link to="/tracker" className="btn btn-secondary btn-sm">{t("View all")} →</Link>
                </div>
                <div className="issue-list">
                  {recentIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} compact />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="home-right">
              {/* Trending Issues */}
              <section className="home-section">
                <div className="section-header">
                  <h2 className="section-title">🔥 {t("Trending")}</h2>
                </div>
                <div className="trending-list">
                  {trendingIssues.map((issue, i) => (
                    <Link to={`/issue/${issue.id}`} key={issue.id} className="trending-item">
                      <div className="trending-rank">#{i + 1}</div>
                      <div className="trending-info">
                        <div className="trending-title">{issue.title}</div>
                        <div className="trending-meta">
                          <span className="text-xs text-muted">
                            {CATEGORIES.find(c=>c.id===issue.category)?.icon} {t(CATEGORIES.find(c=>c.id===issue.category)?.label)}
                          </span>
                          <span className="vote-count-badge">▲ {issue.votes}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Category Breakdown */}
              <section className="home-section">
                <div className="section-header">
                  <h2 className="section-title">📂 {t("Categories")}</h2>
                </div>
                <div className="category-grid">
                  {CATEGORIES.map(cat => {
                    const count = issues.filter(i => i.category === cat.id).length;
                    return (
                      <Link to={`/tracker?cat=${cat.id}`} key={cat.id} className="category-chip">
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-label">{t(cat.label)}</span>
                        <span className="cat-count" style={{ color: cat.color }}>{count}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Ward Authority Preview */}
              <section className="home-section ward-official-preview" style={{ background: 'linear-gradient(145deg, rgba(79, 110, 247, 0.08), rgba(79, 110, 247, 0.02))', borderColor: 'rgba(79, 110, 247, 0.2)' }}>
                <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                  <h2 className="section-title" style={{ color: 'var(--accent-primary)' }}>🏛️ {t("Your Ward Authority")}</h2>
                  <Link to="/officials" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>{t("View Hub")} →</Link>
                </div>
                <div className="official-preview-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="official-preview-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="official-preview-avatar" style={{ fontSize: '2rem' }}>{activeOfficial.officialPhoto}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="font-semibold" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeOfficial.officialName}</div>
                      <div className="text-xs text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeOfficial.ward} {t("Ward In-Charge")}</div>
                    </div>
                  </div>
                  <div className="official-preview-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '6px', padding: '0.5rem', textAlign: 'center' }}>
                      <div className="text-xs text-muted" style={{ fontSize: '0.65rem' }}>{t("Resolution Rate")}</div>
                      <div className="font-bold positive" style={{ fontSize: '0.9rem', marginTop: '0.15rem' }}>{activeOfficial.score}%</div>
                    </div>
                    <div style={{ background: 'var(--bg-glass)', borderRadius: '6px', padding: '0.5rem', textAlign: 'center' }}>
                      <div className="text-xs text-muted" style={{ fontSize: '0.65rem' }}>{t("Citizen Rating")}</div>
                      <div className="font-bold" style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', marginTop: '0.15rem' }}>⭐ {activeOfficial.officialRating}</div>
                    </div>
                  </div>
                  <a href={`mailto:${activeOfficial.email}`} className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '0.45rem' }}>
                    ✉️ {t("Email Ward Official")}
                  </a>
                </div>
              </section>

              {/* Your Contribution */}
              <section className="home-section user-contribution">
                <div className="contrib-header">
                  <span className="contrib-avatar">{currentUser.avatar}</span>
                  <div>
                    <div className="font-semibold">{currentUser.name}</div>
                    <div className="text-xs text-muted">{t("Level")} {currentUser.level} {t("Citizen")}</div>
                  </div>
                </div>
                <div className="contrib-stats">
                  <div className="contrib-stat">
                    <div className="contrib-value">{currentUser.issuesReported}</div>
                    <div className="contrib-label">{t("Reported")}</div>
                  </div>
                  <div className="contrib-stat">
                    <div className="contrib-value">{currentUser.points}</div>
                    <div className="contrib-label">{t("Points")}</div>
                  </div>
                  <div className="contrib-stat">
                    <div className="contrib-value">{currentUser.badges.length}</div>
                    <div className="contrib-label">{t("Badges")}</div>
                  </div>
                </div>
                <Link to="/leaderboard" className="btn btn-primary w-full" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                  {t("View Leaderboard")}
                </Link>
              </section>

              {/* Quick Subsidies Preview */}
              <section className="home-section quick-subsidies-preview" style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.08), rgba(5,150,105,0.03))', borderColor: 'rgba(16,185,129,0.2)' }}>
                <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                  <h2 className="section-title" style={{ color: 'var(--accent-secondary)' }}>🎟️ {t("Utility Subsidies")}</h2>
                </div>
                {currentUser.linkedAccounts ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {currentUser.linkedAccounts.bescom && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span className="text-muted">⚡ BESCOM Linked:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{currentUser.linkedAccounts.bescom}</strong>
                      </div>
                    )}
                    {currentUser.linkedAccounts.bwssb && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span className="text-muted">🚰 BWSSB Linked:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{currentUser.linkedAccounts.bwssb}</strong>
                      </div>
                    )}
                    {currentUser.linkedAccounts.upi && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span className="text-muted">💳 UPI ID:</span>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.7rem' }}>{currentUser.linkedAccounts.upi}</strong>
                      </div>
                    )}
                    <Link to="/subsidies?tab=link" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '0.35rem', marginTop: '0.5rem' }}>
                      ⚙️ {t("Manage Accounts")}
                    </Link>
                  </div>
                ) : currentUser.vouchers && currentUser.vouchers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ⚡ {currentUser.vouchers[0].rewardLabel}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>{t("Auto-Applied")}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                        -{currentUser.vouchers[0].cost} pts
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                      {t("Link your BESCOM/BWSSB account to redeem your points as direct cashback on monthly bills.")}
                    </p>
                    <Link to="/subsidies?tab=link" className="btn btn-success btn-sm w-full" style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '0.5rem' }}>
                      {t("Link Utility Account")} →
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* AI Predictive Alerts (Spans full width below) */}
          <section className="home-section ai-predictions-section">
            <div className="section-header">
              <h2 className="section-title">🔮 {t("AI Predictions")}</h2>
            </div>
            <div className="alerts-list">
              {PREDICTIVE_ALERTS.map(alert => (
                <div key={alert.id} className={`alert-item alert-${alert.urgency}`} style={{ margin: 0 }}>
                  <div className="alert-icon">{alert.icon}</div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-desc text-xs text-muted">{alert.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Restructured About Section */}
      <section className="about-section">
        <div className="about-card">
          <div className="about-header">
            <div className="about-header-left">
              <h2 className="about-title">{t("About Civizen")}</h2>
              <p className="about-subtitle">{t("Hyperlocal Civic Engagement Portal")}</p>
            </div>
            <div className="about-header-right">
              <p className="about-mission">
                {t("Bypassing bureaucratic delays using smart technology. We coordinate citizens, AI auditors, and municipal utility providers (BBMP, BESCOM, BWSSB) to resolve local infrastructure issues rapidly.")}
              </p>
            </div>
          </div>
          
          <div className="about-grid">
            <div className="about-sub-card">
              <div className="about-card-icon">👥</div>
              <h3 className="about-col-title">{t("Who We Are")}</h3>
              <p className="about-text" style={{ flex: 1 }}>
                {t("We are Civizen Community Champions, a network of dedicated residents, civic leaders, and local ward engineers collaborating to build cleaner, safer, and better-managed neighbourhoods.")}
              </p>
              <div className="about-tags-list">
                <span className="about-tag-badge">🏠 {t("Hyperlocal Network")}</span>
                <span className="about-tag-badge">👷 {t("Ward Engineers")}</span>
                <span className="about-tag-badge">🤝 {t("Citizen Alliance")}</span>
              </div>
            </div>

            <div className="about-sub-card">
              <div className="about-card-icon">⚡</div>
              <h3 className="about-col-title">{t("What This Does")}</h3>
              <p className="about-text" style={{ flex: 1 }}>
                {t("Civizen bypasses traditional bureaucratic delays. By combining AI-powered ticket routing, community verification voting, and utility bill points incentives, we empower citizens to identify, audit, and coordinate resolution directly with officials.")}
              </p>
              <div className="about-tags-list">
                <span className="about-tag-badge">🤖 {t("AI Ticket Routing")}</span>
                <span className="about-tag-badge">🗳️ {t("Auditor Voting")}</span>
                <span className="about-tag-badge">🎟️ {t("Redeemable Subsidies")}</span>
              </div>
            </div>

            <div className="about-sub-card">
              <div className="about-card-icon">🌱</div>
              <h3 className="about-col-title">{t("Our Civic Vision")}</h3>
              <p className="about-text" style={{ flex: 1 }}>
                {t("We aim to co-create sustainable, smart, and highly-responsive urban environments where citizens are not passive observers, but active partners in municipal governance. By leveraging modern technology, we turn complaints into constructive actions.")}
              </p>
              <div className="about-tags-list">
                <span className="about-tag-badge">📈 {t("Smart Governance")}</span>
                <span className="about-tag-badge">⚖️ {t("Transparent Audit")}</span>
                <span className="about-tag-badge">🌳 {t("Green Neighbourhoods")}</span>
              </div>
            </div>
          </div>

          <div className="about-features-row">
            <div className="about-feature-badge">
              <span className="feat-badge-icon">🤖</span>
              <span><strong>{t("AI Classifier")}</strong>: {t("Automated categorisation & priority classification")}</span>
            </div>
            <div className="about-feature-badge">
              <span className="feat-badge-icon">🛡️</span>
              <span><strong>{t("Community Consensus")}</strong>: {t("Decentralized validation via citizen voting")}</span>
            </div>
            <div className="about-feature-badge">
              <span className="feat-badge-icon">🎟️</span>
              <span><strong>{t("Subsidies Wallet")}</strong>: {t("Points redeemable for monthly utility discounts")}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
