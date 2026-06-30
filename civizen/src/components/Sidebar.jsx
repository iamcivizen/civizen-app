import { NavLink, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home', exact: true },
  { path: '/report', icon: '📝', label: 'Report Issue', badge: 'AI' },
  { path: '/map', icon: '🗺️', label: 'Issue Map' },
  { path: '/tracker', icon: '📋', label: 'Issue Tracker' },
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { path: '/subsidies', icon: '🎟️', label: 'Redeem Subsidies', badge: 'UPI/BBPS', badgeClass: 'subsidies-badge' },
  { path: '/officials', icon: '🏛️', label: 'Ward Officials' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentUser, issues, isLoggedIn, sidebarOpen } = state;
  const location = useLocation();
  const t = useTranslation();

  const openCount = issues.filter(i => ['reported','verified','in_progress'].includes(i.status)).length;

  return (
    <>
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => dispatch({ type: 'SET_SIDEBAR', payload: false })}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <span className="logo-main">Civi</span>
            <span className="logo-sub">zen</span>
          </div>
        </div>

        {/* User Profile & Progress Link */}
        {isLoggedIn ? (
          <Link 
            to="/dashboard?tab=personal" 
            className="sidebar-user-link-wrapper"
            onClick={() => dispatch({ type: 'SET_SIDEBAR', payload: false })}
          >
            {/* User Profile Card */}
            <div className="sidebar-user">
              <div className="user-avatar">{currentUser.avatar}</div>
              <div className="user-info">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-level">{t("Level")} {currentUser.level} {t("Citizen")}</div>
              </div>
              <div className="user-points">
                <span className="points-value">{currentUser.points.toLocaleString()}</span>
                <span className="points-label">pts</span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="sidebar-xp">
              <div className="xp-labels">
                <span className="text-xs text-muted">{t("XP Progress")}</span>
                <span className="text-xs text-muted">{currentUser.points % 500}/500</span>
              </div>
              <div className="progress-bar" style={{ marginTop: '0.375rem' }}>
                <div className="progress-bar-fill" style={{ width: `${((currentUser.points % 500) / 500) * 100}%` }} />
              </div>
            </div>
          </Link>
        ) : (
          <div 
            className="sidebar-guest-card" 
            onClick={() => {
              dispatch({ type: 'SET_LOGIN_MODAL', payload: true });
              dispatch({ type: 'SET_SIDEBAR', payload: false });
            }} 
            style={{ cursor: 'pointer' }}
          >
            <div className="guest-avatar">👤</div>
            <div className="guest-info">
              <div className="guest-name">{t("Welcome, Guest")}</div>
              <div className="guest-desc text-xs text-muted">{t("Log in to start contributing")}</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">{t("Navigation")}</div>
          {NAV_ITEMS.filter(item => isLoggedIn || item.path === '/').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_SIDEBAR', payload: false })}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{t(item.label)}</span>
              {item.badge && <span className={`nav-badge ${item.badgeClass || 'ai-badge'}`}>{item.badge}</span>}
              {item.path === '/tracker' && openCount > 0 && (
                <span className="nav-badge count-badge">{openCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

      {/* Quick Stats */}
      {isLoggedIn && (
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              {issues.filter(i => i.status === 'resolved').length}
            </span>
            <span className="text-xs text-muted">{t("Resolved")}</span>
          </div>
          <div className="sidebar-stat">
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-orange)' }}>
              {openCount}
            </span>
            <span className="text-xs text-muted">{t("Open")}</span>
          </div>
          <div className="sidebar-stat">
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
              {currentUser.badges.length}
            </span>
            <span className="text-xs text-muted">{t("Badges")}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="text-xs text-muted">🌆 Bangalore, India</span>
        <span className="live-dot"></span>
        <span className="text-xs text-muted">Live</span>
      </div>
    </aside>
   </>
  );
}
