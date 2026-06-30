import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import './BottomNav.css';

export default function BottomNav() {
  const { state, dispatch } = useApp();
  const { isLoggedIn } = state;
  const t = useTranslation();

  return (
    <div className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🏠</span>
        <span className="bottom-nav-label">{t("Home")}</span>
      </NavLink>

      {isLoggedIn ? (
        <>
          <NavLink to="/report" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <span className="bottom-nav-icon">📝</span>
            <span className="bottom-nav-label">{t("Report")}</span>
          </NavLink>

          <NavLink to="/map" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <span className="bottom-nav-icon">🗺️</span>
            <span className="bottom-nav-label">{t("Map")}</span>
          </NavLink>

          <NavLink to="/tracker" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <span className="bottom-nav-icon">📋</span>
            <span className="bottom-nav-label">{t("Tracker")}</span>
          </NavLink>

          <NavLink to="/leaderboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <span className="bottom-nav-icon">🏆</span>
            <span className="bottom-nav-label">{t("Leaderboard")}</span>
          </NavLink>
        </>
      ) : (
        <button 
          onClick={() => dispatch({ type: 'SET_LOGIN_MODAL', payload: true })}
          className="bottom-nav-item bottom-nav-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span className="bottom-nav-icon">🔑</span>
          <span className="bottom-nav-label">{t("Log In")}</span>
        </button>
      )}
    </div>
  );
}
