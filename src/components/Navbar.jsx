import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import { CATEGORIES } from '../data/categories.js';
import './Navbar.css';

export default function Navbar() {
  const { state, dispatch } = useApp();
  const { currentUser, notifications, isLoggedIn } = state;
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState(currentUser.aadhaar || '');
  const [aadhaarError, setAadhaarError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [editProfileForm, setEditProfileForm] = useState({
    name: currentUser.name || '',
    age: currentUser.age || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    gender: currentUser.gender || 'Male',
    occupation: currentUser.occupation || 'Salaried Professional',
  });

  const [prefForm, setPrefForm] = useState({
    smsAlerts: true,
    emailAlerts: true,
    pushAlerts: true,
    primaryWard: 'Ward 42 (HSR Layout)',
    geofenceRadius: '1km',
    appLanguage: 'English',
    textSize: 'Medium',
  });

  useEffect(() => {
    if (showProfile) {
      setEditProfileForm({
        name: currentUser.name || '',
        age: currentUser.age || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        gender: currentUser.gender || 'Male',
        occupation: currentUser.occupation || 'Salaried Professional',
      });
      setAadhaarInput(currentUser.aadhaar || '');
      setAadhaarError('');
      setActiveSettingsTab('profile');
    }
  }, [showProfile, currentUser]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        name: editProfileForm.name,
        age: Number(editProfileForm.age),
        phone: editProfileForm.phone,
        address: editProfileForm.address,
        gender: editProfileForm.gender,
        occupation: editProfileForm.occupation
      }
    });
  };

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  // Login Modal States
  const { showLoginModal } = state;
  const setShowLoginModal = (val) => dispatch({ type: 'SET_LOGIN_MODAL', payload: val });
  const [loginStep, setLoginStep] = useState(1); // 1 = Details, 2 = OTP
  const [loginForm, setLoginForm] = useState({
    name: '',
    age: '',
    area: 'Ward 150 - Bellandur',
    aadhaar: '',
    phone: '',
    gender: 'Male',
    occupation: 'Salaried Professional',
    address: '',
    consent: false
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [otpVal, setOtpVal] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleAutofillAisha = () => {
    setLoginForm({
      name: 'Aisha Rahman',
      age: '28',
      area: 'Ward 174 - HSR Layout',
      aadhaar: '987654321012',
      phone: '9876543210',
      gender: 'Female',
      occupation: 'Salaried Professional',
      address: 'Flat 402, Shanti Niketan Apartments, 5th Main Road, HSR Layout, Bengaluru',
      consent: true
    });
    setLoginErrors({});
  };

  const handleAutofillDave = () => {
    setLoginForm({
      name: 'Dave Morrison',
      age: '34',
      area: 'Ward 150 - Bellandur',
      aadhaar: '876543210987',
      phone: '8765432109',
      gender: 'Male',
      occupation: 'Self-Employed',
      address: 'House 14, 2nd Cross, Bellandur Lake Road, Bengaluru',
      consent: true
    });
    setLoginErrors({});
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.account-modal-content') || event.target.closest('.login-modal-content')) {
        return;
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLang(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const PAGE_TITLES = {
    '/': '🏠 Home',
    '/report': '📝 Report Issue',
    '/map': '🗺️ Issue Map',
    '/tracker': '📋 Issue Tracker',
    '/dashboard': '📊 Impact Dashboard',
    '/leaderboard': '🏆 Leaderboard',
    '/subsidies': 'Redeem Subsidies',
    '/officials': '🏛️ Ward Officials',
  };

  const rawTitle = PAGE_TITLES[location.pathname];
  const title = rawTitle ? t(rawTitle) : 'Civizen';
  const unreadCount = notifications.length;

  const handleLinkAadhaar = () => {
    if (aadhaarInput.length !== 12 || isNaN(Number(aadhaarInput))) {
      setAadhaarError('Aadhaar must be a 12-digit number');
      return;
    }
    dispatch({ type: 'SET_AADHAAR', payload: aadhaarInput });
  };

  const handleLoginFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!loginForm.name.trim()) errors.name = 'Name is required';
    if (!loginForm.age) {
      errors.age = 'Age is required';
    } else if (Number(loginForm.age) < 18) {
      errors.age = '⚠️ You must be 18 or older to report issues';
    }
    if (!loginForm.aadhaar.trim()) {
      errors.aadhaar = 'Aadhaar is required';
    } else if (loginForm.aadhaar.length !== 12 || isNaN(Number(loginForm.aadhaar))) {
      errors.aadhaar = 'Aadhaar must be a 12-digit number';
    }
    if (!loginForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (loginForm.phone.length !== 10 || isNaN(Number(loginForm.phone))) {
      errors.phone = 'Phone number must be a 10-digit number';
    }
    if (!loginForm.consent) {
      errors.consent = 'You must consent to participate';
    }
    if (!loginForm.address.trim()) {
      errors.address = 'Address is required';
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    setLoginStep(2);
    setOtpVal('');
    setOtpError('');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpVal.trim()) {
      setOtpError('Please enter OTP');
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      dispatch({ type: 'LOGIN_USER', payload: loginForm });
      setShowLoginModal(false);
      setLoginStep(1);
    }, 1200);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-center">
        <div className="search-bar" ref={searchRef}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={isLoggedIn ? t("Search issues, locations...") : t("Log in to search or report issues...")}
            className="search-input"
            value={state.searchQuery}
            onChange={e => {
              dispatch({ type: 'SET_SEARCH', payload: e.target.value });
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            id="global-search"
            disabled={!isLoggedIn}
            style={{ cursor: isLoggedIn ? 'text' : 'not-allowed', opacity: isLoggedIn ? 1 : 0.6 }}
          />
          {isLoggedIn && state.searchQuery && (
            <button
              className="search-clear"
              onClick={() => {
                dispatch({ type: 'SET_SEARCH', payload: '' });
                setShowSuggestions(false);
              }}
            >
              ✕
            </button>
          )}

          {/* YouTube-style suggestions dropdown */}
          {isLoggedIn && showSuggestions && (
            <div className="search-suggestions-dropdown">
              {state.searchQuery.trim() === '' ? (
                /* Recommended searches */
                <div className="suggestion-section">
                  <div className="suggestion-section-title">🔥 {t("Trending Searches")}</div>
                  <div className="suggestion-item" onClick={() => { dispatch({ type: 'SET_SEARCH', payload: 'pothole' }); navigate('/tracker'); setShowSuggestions(false); }}>
                    <span className="suggestion-item-icon">🔍</span>
                    <span className="suggestion-item-text">{t("Pothole repairs near Koramangala")}</span>
                  </div>
                  <div className="suggestion-item" onClick={() => { navigate('/subsidies'); setShowSuggestions(false); }}>
                    <span className="suggestion-item-icon">🎟️</span>
                    <span className="suggestion-item-text">{t("Redeem BWSSB / BESCOM utility cashback")}</span>
                  </div>
                  <div className="suggestion-item" onClick={() => { navigate('/officials'); setShowSuggestions(false); }}>
                    <span className="suggestion-item-icon">🏛️</span>
                    <span className="suggestion-item-text">{t("Contact Ward Duty Officer directly")}</span>
                  </div>
                  <div className="suggestion-item" onClick={() => { dispatch({ type: 'SET_SEARCH', payload: 'water' }); navigate('/tracker'); setShowSuggestions(false); }}>
                    <span className="suggestion-item-icon">🔍</span>
                    <span className="suggestion-item-text">{t("Water logging & leakage complaints")}</span>
                  </div>
                </div>
              ) : (
                /* Dynamic filtered suggestions */
                <>
                  {/* Matched Complaints */}
                  {state.issues.filter(i => 
                    i.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                    i.description.toLowerCase().includes(state.searchQuery.toLowerCase())
                  ).length > 0 && (
                    <div className="suggestion-section">
                      <div className="suggestion-section-title">📋 {t("Matched Complaints")}</div>
                      {state.issues.filter(i => 
                        i.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                        i.description.toLowerCase().includes(state.searchQuery.toLowerCase())
                      ).slice(0, 3).map(issue => (
                        <div key={issue.id} className="suggestion-item" onClick={() => { navigate(`/issue/${issue.id}`); setShowSuggestions(false); }}>
                          <span className="suggestion-item-icon">📌</span>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span className="suggestion-item-text" style={{ fontWeight: 600 }}>{issue.title}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>📍 {t(issue.ward)} • {issue.status.toUpperCase()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Categories */}
                  {CATEGORIES.filter(c => 
                    t(c.label).toLowerCase().includes(state.searchQuery.toLowerCase())
                  ).length > 0 && (
                    <div className="suggestion-section">
                      <div className="suggestion-section-title">📂 {t("Categories")}</div>
                      {CATEGORIES.filter(c => 
                        t(c.label).toLowerCase().includes(state.searchQuery.toLowerCase())
                      ).slice(0, 2).map(cat => (
                        <div key={cat.id} className="suggestion-item" onClick={() => { navigate(`/tracker?cat=${cat.id}`); setShowSuggestions(false); }}>
                          <span className="suggestion-item-icon">{cat.icon}</span>
                          <span className="suggestion-item-text">{t(cat.label)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Navigations */}
                  {[
                    { title: 'Redeem Subsidies', path: '/subsidies', icon: '🎟️' },
                    { title: 'Ward Officials & Contact', path: '/officials', icon: '🏛️' },
                    { title: 'Leaderboard & Champions', path: '/leaderboard', icon: '🏆' },
                    { title: 'Issue Map View', path: '/map', icon: '🗺️' },
                    { title: 'Report New Issue', path: '/report', icon: '📝' }
                  ].filter(s => 
                    t(s.title).toLowerCase().includes(state.searchQuery.toLowerCase())
                  ).length > 0 && (
                    <div className="suggestion-section">
                      <div className="suggestion-section-title">⚙️ {t("Quick Navigation")}</div>
                      {[
                        { title: 'Redeem Subsidies', path: '/subsidies', icon: '🎟️' },
                        { title: 'Ward Officials & Contact', path: '/officials', icon: '🏛️' },
                        { title: 'Leaderboard & Champions', path: '/leaderboard', icon: '🏆' },
                        { title: 'Issue Map View', path: '/map', icon: '🗺️' },
                        { title: 'Report New Issue', path: '/report', icon: '📝' }
                      ].filter(s => 
                        t(s.title).toLowerCase().includes(state.searchQuery.toLowerCase())
                      ).slice(0, 2).map(sec => (
                        <div key={sec.path} className="suggestion-item" onClick={() => { navigate(sec.path); setShowSuggestions(false); }}>
                          <span className="suggestion-item-icon">{sec.icon}</span>
                          <span className="suggestion-item-text">{t(sec.title)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Default search all link */}
                  <div className="suggestion-item" onClick={() => { navigate('/tracker'); setShowSuggestions(false); }}>
                    <span className="suggestion-item-icon">🔍</span>
                    <span className="suggestion-item-text" style={{ fontStyle: 'italic' }}>{t("Search all matches for")} "{state.searchQuery}"</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {isLoggedIn && (
          /* Notification Bell */
          <div ref={notifRef} className="notif-wrapper">
            <button
              id="notif-btn"
              className="navbar-icon-btn"
              onClick={() => setShowNotifs(!showNotifs)}
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifs && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => notifications.forEach(n => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id }))}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="notif-empty">No new notifications</div>
                ) : (
                  <div className="notif-list">
                    {notifications.slice(0, 5).map(n => (
                      <div key={n.id} className={`notif-item notif-${n.type}`}>
                        <p className="notif-msg">{n.message}</p>
                        <button
                          className="notif-dismiss"
                          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id })}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })}
          className="navbar-icon-btn"
          style={{ fontSize: '1.15rem' }}
          title={state.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {state.theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Language Selector Dropdown */}
        <div ref={langRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            id="navbar-lang-btn"
            className="navbar-icon-btn"
            onClick={() => setShowLang(!showLang)}
            title="Change Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
            style={{ fontSize: '1.1rem' }}
          >
            🌐
          </button>
          
          {showLang && (
            <div 
              className="lang-dropdown"
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '160px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-accent)',
                borderRadius: '12px',
                padding: '0.5rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <button
                className={`lang-option-btn ${state.language === 'en' ? 'active' : ''}`}
                onClick={() => { dispatch({ type: 'SET_LANGUAGE', payload: 'en' }); setShowLang(false); }}
                style={{
                  background: state.language === 'en' ? 'var(--gradient-primary)' : 'none',
                  color: state.language === 'en' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: state.language === 'en' ? 700 : 500,
                  transition: 'var(--transition)'
                }}
              >
                English
              </button>
              <button
                className={`lang-option-btn ${state.language === 'en-kn' ? 'active' : ''}`}
                onClick={() => { dispatch({ type: 'SET_LANGUAGE', payload: 'en-kn' }); setShowLang(false); }}
                style={{
                  background: state.language === 'en-kn' ? 'var(--gradient-primary)' : 'none',
                  color: state.language === 'en-kn' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: state.language === 'en-kn' ? 700 : 500,
                  transition: 'var(--transition)'
                }}
              >
                ಕನ್ನಡ
              </button>
              <button
                className={`lang-option-btn ${state.language === 'en-hi' ? 'active' : ''}`}
                onClick={() => { dispatch({ type: 'SET_LANGUAGE', payload: 'en-hi' }); setShowLang(false); }}
                style={{
                  background: state.language === 'en-hi' ? 'var(--gradient-primary)' : 'none',
                  color: state.language === 'en-hi' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: state.language === 'en-hi' ? 700 : 500,
                  transition: 'var(--transition)'
                }}
              >
                हिंदी
              </button>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <>
            {/* Report CTA */}
            <Link to="/report" id="navbar-report-btn" className="btn btn-primary btn-sm">
              + {t("Report Issue")}
            </Link>

            {/* User Avatar & Account Profile details dropdown */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div
                id="navbar-avatar-btn"
                className="navbar-avatar"
                title={currentUser.name}
                onClick={() => setShowProfile(!showProfile)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {currentUser.avatar}
              </div>

              {showProfile && createPortal(
                <div className="login-modal-backdrop" style={{ zIndex: 10000 }}>
                  <div className="account-modal-content card">
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.25rem 1.5rem',
                      borderBottom: '1px solid var(--border-primary)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 800 }}>
                          {t("Account Settings & Preferences")}
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowProfile(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Main Columns Container */}
                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                      {/* Left Tab Navigation */}
                      <div className="account-sidebar" style={{
                        width: '180px',
                        borderRight: '1px solid var(--border-primary)',
                        padding: '1rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        background: 'rgba(0,0,0,0.15)'
                      }}>
                        <button
                          className={`account-tab-btn ${activeSettingsTab === 'profile' ? 'active' : ''}`}
                          onClick={() => setActiveSettingsTab('profile')}
                        >
                          👤 {t("Profile Details")}
                        </button>
                        <button
                          className={`account-tab-btn ${activeSettingsTab === 'theme' ? 'active' : ''}`}
                          onClick={() => setActiveSettingsTab('theme')}
                        >
                          🎨 {t("Theme Options")}
                        </button>
                        <button
                          className={`account-tab-btn ${activeSettingsTab === 'aadhaar' ? 'active' : ''}`}
                          onClick={() => setActiveSettingsTab('aadhaar')}
                        >
                          🆔 {t("Aadhaar Identity")}
                        </button>
                        <button
                          className={`account-tab-btn ${activeSettingsTab === 'leaderboard' ? 'active' : ''}`}
                          onClick={() => setActiveSettingsTab('leaderboard')}
                        >
                          🏆 {t("Leaderboard")}
                        </button>
                        <button
                          className={`account-tab-btn ${activeSettingsTab === 'preferences' ? 'active' : ''}`}
                          onClick={() => setActiveSettingsTab('preferences')}
                        >
                          ⚙️ {t("Preferences & Privacy")}
                        </button>
                        <div style={{ flex: 1 }} />
                        <button
                          className="account-tab-btn logout-tab-btn"
                          onClick={() => setActiveSettingsTab('logout')}
                          style={{
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            background: activeSettingsTab === 'logout' ? 'rgba(239, 68, 68, 0.12)' : 'transparent'
                          }}
                        >
                          🚪 {t("Log Out")}
                        </button>
                      </div>

                      {/* Right Detail Pane */}
                      <div className="account-pane" style={{
                        flex: 1,
                        padding: '1.5rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        {activeSettingsTab === 'profile' && (
                          <div style={{ display: 'flex', gap: '1.75rem', height: '100%', padding: '0.25rem 0' }}>
                            {/* Left: Edit Form */}
                            <form onSubmit={handleSaveProfile} style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                                <div style={{ fontSize: '2.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {currentUser.avatar}
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{currentUser.name}</h4>
                                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: '#6366f1', fontWeight: 700 }}>
                                    Level {currentUser.level} Citizen
                                  </p>
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                  <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Full Name</label>
                                  <input
                                    type="text"
                                    className="input-field"
                                    value={editProfileForm.name}
                                    onChange={e => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                                    required
                                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', width: '100%' }}
                                  />
                                </div>
                                <div>
                                  <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Age</label>
                                  <input
                                    type="number"
                                    className="input-field"
                                    value={editProfileForm.age}
                                    onChange={e => setEditProfileForm({ ...editProfileForm, age: e.target.value })}
                                    required
                                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', width: '100%' }}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                  <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Gender</label>
                                  <select
                                    className="input-field"
                                    value={editProfileForm.gender}
                                    onChange={e => setEditProfileForm({ ...editProfileForm, gender: e.target.value })}
                                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', width: '100%', height: '35px' }}
                                  >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-Binary">Non-Binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Occupation</label>
                                  <select
                                    className="input-field"
                                    value={editProfileForm.occupation}
                                    onChange={e => setEditProfileForm({ ...editProfileForm, occupation: e.target.value })}
                                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', width: '100%', height: '35px' }}
                                  >
                                    <option value="Salaried Professional">Salaried Professional</option>
                                    <option value="Self-Employed">Self-Employed</option>
                                    <option value="Student">Student</option>
                                    <option value="Homemaker">Homemaker</option>
                                    <option value="Retired">Retired</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Phone Number</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  value={editProfileForm.phone}
                                  onChange={e => setEditProfileForm({ ...editProfileForm, phone: e.target.value.replace(/\D/g, '') })}
                                  required
                                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', width: '100%' }}
                                />
                              </div>

                              <div>
                                <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Home Address</label>
                                <textarea
                                  className="input-field"
                                  rows={2}
                                  value={editProfileForm.address}
                                  onChange={e => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                                  required
                                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', width: '100%', resize: 'none' }}
                                />
                              </div>

                              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.25rem', width: '100%', justifyContent: 'center' }}>
                                Save Profile Changes
                              </button>
                            </form>

                            {/* Right: Original Stats & Impact Buttons */}
                            <div style={{
                              flex: 0.9,
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid var(--border-primary)',
                              borderRadius: '12px',
                              padding: '1.25rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.85rem',
                              justifyContent: 'space-between',
                              height: 'fit-content'
                            }}>
                              <div>
                                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  📊 {t("Citizen Statistics")}
                                </h4>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Wallet Balance:</span>
                                    <span style={{ fontWeight: 750, color: '#fbbf24' }}>⭐ {currentUser.points} XP</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Issues Reported:</span>
                                    <span style={{ fontWeight: 750 }}>{currentUser.issuesReported} reports</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Issues Verified:</span>
                                    <span style={{ fontWeight: 750 }}>{currentUser.issuesVerified || 0} verifications</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Daily Streak:</span>
                                    <span style={{ fontWeight: 750 }}>🔥 {currentUser.streak || 0} days</span>
                                  </div>
                                </div>
                              </div>

                              <Link
                                to="/dashboard?tab=personal"
                                onClick={() => setShowProfile(false)}
                                className="btn btn-secondary btn-sm"
                                style={{ justifyContent: 'center', width: '100%', fontWeight: 700, marginTop: '0.5rem' }}
                              >
                                📈 {t("View Personal Impact")}
                              </Link>
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'theme' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Theme Selector</h4>
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Choose your preferred design aesthetic for the Civizen application.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div
                                onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
                                style={{
                                  padding: '1.5rem',
                                  borderRadius: '12px',
                                  border: state.theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                                  background: 'rgba(255,255,255,0.05)',
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>☀️</span>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Light Mode</strong>
                              </div>
                              <div
                                onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
                                style={{
                                  padding: '1.5rem',
                                  borderRadius: '12px',
                                  border: state.theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                                  background: 'rgba(255,255,255,0.05)',
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🌙</span>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Dark Mode</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'aadhaar' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Aadhaar Identity Linkage</h4>
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Secure identity verification is required under local policy guidelines to establish ticket validity and audit rights.</p>
                            </div>
                            
                            {currentUser.aadhaar ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <span style={{ fontSize: '1.5rem' }}>✅</span>
                                <div>
                                  <strong style={{ fontSize: '0.8rem', color: '#34d399', display: 'block' }}>Aadhaar Linked & Verified</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                    UIDAI ID: XXXX-XXXX-{currentUser.aadhaar.slice(-4)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div className="input-group">
                                  <label className="input-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Enter 12-digit Aadhaar Number</label>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                      type="text"
                                      className="input-field"
                                      placeholder="XXXX XXXX XXXX"
                                      maxLength="12"
                                      value={aadhaarInput}
                                      onChange={(e) => {
                                        setAadhaarInput(e.target.value.replace(/\D/g, '').slice(0, 12));
                                        setAadhaarError('');
                                      }}
                                      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-accent)', color: 'var(--text-primary)', padding: '0.45rem', fontSize: '0.82rem', borderRadius: '6px', flex: 1 }}
                                    />
                                    <button onClick={handleLinkAadhaar} className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
                                      Link
                                    </button>
                                  </div>
                                  {aadhaarError && (
                                    <span style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                                      ⚠️ {aadhaarError}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {activeSettingsTab === 'leaderboard' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Leaderboard Participation Consent</h4>
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Under DPDPA-2023 privacy mandates, you control how your information is displayed publicly on community leaderboard views.</p>
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'start',
                              gap: '0.75rem',
                              background: 'rgba(255,255,255,0.03)',
                              padding: '1rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-primary)',
                              opacity: currentUser.leaderboardConsent ? 0.75 : 1
                            }}>
                              <input
                                type="checkbox"
                                id="settings-leaderboard-consent"
                                checked={currentUser.leaderboardConsent}
                                disabled={currentUser.leaderboardConsent}
                                onChange={(e) => {
                                  if (!currentUser.leaderboardConsent) {
                                    dispatch({
                                      type: 'UPDATE_PROFILE',
                                      payload: {
                                        leaderboardConsent: e.target.checked,
                                        leaderboardConsentDate: e.target.checked 
                                          ? new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                          : ''
                                      }
                                    });
                                  }
                                }}
                                style={{ marginTop: '0.25rem', transform: 'scale(1.15)', cursor: currentUser.leaderboardConsent ? 'not-allowed' : 'pointer' }}
                              />
                              <label htmlFor="settings-leaderboard-consent" style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4, cursor: currentUser.leaderboardConsent ? 'not-allowed' : 'pointer' }}>
                                <strong>Public Participation Active</strong>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                  Include my name, citizen level, achievements, and points publicly on the ward ranking board.
                                </span>
                              </label>
                            </div>
                            
                            {currentUser.leaderboardConsent ? (
                              <div style={{
                                padding: '1rem',
                                background: 'rgba(99, 102, 241, 0.05)',
                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.4'
                              }}>
                                🔒 <strong>Consent Locked:</strong> Under active local community guidelines, leaderboard consent is requested during verification setup and cannot be removed directly from the profile. 
                                <br /><br />
                                If you wish to revoke consent or request details deletion under DPDPA-2023 rights, please contact our support team at:
                                <a href="mailto:support@civizen.com" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>
                                  support@civizen.com
                                </a>
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.7rem', color: 'var(--accent-orange)' }}>
                                ⚠️ Consent not yet enabled. Enable it above to showcase achievements.
                              </div>
                            )}
                          </div>
                        )}

                        {activeSettingsTab === 'preferences' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
                              <span style={{ fontSize: '1.1rem' }}>⚙️</span>
                              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t("App Preferences & Privacy Controls")}</h4>
                            </div>

                            {/* Section 1: Notifications */}
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                              <h5 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                🔔 {t("Notification Alerts")}
                              </h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                  <span>{t("SMS Alerts (Priority Municipal Updates)")}</span>
                                  <input 
                                    type="checkbox" 
                                    checked={prefForm.smsAlerts} 
                                    onChange={(e) => setPrefForm(p => ({ ...p, smsAlerts: e.target.checked }))}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                  <span>{t("Email Alerts (Weekly Impact Summaries)")}</span>
                                  <input 
                                    type="checkbox" 
                                    checked={prefForm.emailAlerts} 
                                    onChange={(e) => setPrefForm(p => ({ ...p, emailAlerts: e.target.checked }))}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                  <span>{t("Push Notifications (Nearby Reports & Streaks)")}</span>
                                  <input 
                                    type="checkbox" 
                                    checked={prefForm.pushAlerts} 
                                    onChange={(e) => setPrefForm(p => ({ ...p, pushAlerts: e.target.checked }))}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Section 2: Ward & Geofence Boundary */}
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>📍 {t("Primary Municipal Ward")}</label>
                                <input 
                                  type="text" 
                                  value={prefForm.primaryWard}
                                  onChange={(e) => setPrefForm(p => ({ ...p, primaryWard: e.target.value }))}
                                  style={{ padding: '0.45rem', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--text-primary)' }}
                                />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>🎯 {t("Geofence Alert Radius")}</label>
                                <select 
                                  value={prefForm.geofenceRadius}
                                  onChange={(e) => setPrefForm(p => ({ ...p, geofenceRadius: e.target.value }))}
                                  style={{ padding: '0.45rem', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
                                >
                                  <option value="500m">500m (Immediate Neighborhood)</option>
                                  <option value="1km">1km (Local Ward limits)</option>
                                  <option value="5km">5km (Sub-district limits)</option>
                                </select>
                              </div>
                            </div>

                            {/* Section 3: Localization & Accessibility */}
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>🌐 {t("App Language")}</label>
                                <select 
                                  value={prefForm.appLanguage}
                                  onChange={(e) => setPrefForm(p => ({ ...p, appLanguage: e.target.value }))}
                                  style={{ padding: '0.45rem', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
                                >
                                  <option value="English">English</option>
                                  <option value="Hindi">हिन्दी (Hindi)</option>
                                  <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                                  <option value="Tamil">தமிழ் (Tamil)</option>
                                  <option value="Telugu">తెలుగు (Telugu)</option>
                                </select>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>🔤 {t("Accessibility Text Size")}</label>
                                <select 
                                  value={prefForm.textSize}
                                  onChange={(e) => setPrefForm(p => ({ ...p, textSize: e.target.value }))}
                                  style={{ padding: '0.45rem', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
                                >
                                  <option value="Small">Small (Standard)</option>
                                  <option value="Medium">Medium (Readable)</option>
                                  <option value="Large">Large (Enlarged)</option>
                                </select>
                              </div>
                            </div>

                            {/* Section 4: Data Portability Compliance (DPDPA 2023) */}
                            <div style={{
                              padding: '1rem',
                              background: 'rgba(99, 102, 241, 0.04)',
                              border: '1px solid rgba(99, 102, 241, 0.15)',
                              borderRadius: '8px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem'
                            }}>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                🛡️ <strong>Data Portability & Erasure (DPDPA-2023):</strong> You have active control over your demographic parameters, reporting logs, and privacy consents.
                              </div>
                              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                <button 
                                  onClick={() => {
                                    const mockData = {
                                      profile: editProfileForm,
                                      preferences: prefForm,
                                      stats: { xp: currentUser.xp, streak: currentUser.streak, resolvedIssuesCount: 14 }
                                    };
                                    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'civizen_profile_data.json';
                                    a.click();
                                  }}
                                  className="btn btn-secondary" 
                                  style={{ fontSize: '0.7rem', padding: '0.45rem 0.75rem', flex: 1, justifyContent: 'center' }}
                                >
                                  📥 {t("Export Data Profile")}
                                </button>
                                <button 
                                  onClick={() => {
                                    alert("Erasure Request Logged: Under section 8 of the DPDPA Act, 2023, your profile erasure query has been submitted. A verification email has been sent to your registered contact address.");
                                  }}
                                  className="btn btn-secondary" 
                                  style={{ fontSize: '0.7rem', padding: '0.45rem 0.75rem', flex: 1, justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.25)', color: '#f87171' }}
                                >
                                  🚫 {t("Request Profile Erasure")}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'logout' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', margin: 'auto 0' }}>
                            <span style={{ fontSize: '3rem' }}>🚪</span>
                            <div>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Are you sure you want to log out?</h4>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>You will need to sign in again to file new complaints or vouch for verified issues.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                              <button onClick={() => setActiveSettingsTab('profile')} className="btn btn-secondary" style={{ width: '100px', justifyContent: 'center' }}>
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  dispatch({ type: 'LOGOUT_USER' });
                                  setShowProfile(false);
                                }}
                                className="btn btn-primary"
                                style={{ background: '#ef4444', border: '1px solid #ef4444', width: '100px', justifyContent: 'center' }}
                              >
                                Log Out
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          </>
        ) : (
          <button
            id="navbar-login-btn"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setLoginStep(1);
              setShowLoginModal(true);
            }}
          >
            🔑 {t("Login / Sign Up")}
          </button>
        )}
      </div>

      {showLoginModal && createPortal(
        <div className="login-modal-backdrop">
          <div className="login-modal-content">
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>⚡</span>
              <h3 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 800 }}>
                {t("Join Civizen")}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t("Enter details to sign up / verify identity")}
              </p>
            </div>

            {loginStep === 1 ? (
              <>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px dashed rgba(99, 102, 241, 0.3)',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>
                    💡 Speed up: Autofill Example Persona Credentials
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleAutofillAisha}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'center', fontSize: '0.7rem', padding: '0.35rem', background: 'rgba(255,255,255,0.05)' }}
                    >
                      👩 Aisha (Reporter)
                    </button>
                    <button
                      type="button"
                      onClick={handleAutofillDave}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'center', fontSize: '0.7rem', padding: '0.35rem', background: 'rgba(255,255,255,0.05)' }}
                    >
                      🧔 Dave (Verifier)
                    </button>
                  </div>
                </div>
                <form onSubmit={handleLoginFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={loginForm.name}
                    onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none'
                    }}
                  />
                  {loginErrors.name && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.15rem', display: 'block' }}>{loginErrors.name}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                      Age (must be 18+)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      value={loginForm.age}
                      onChange={e => setLoginForm({ ...loginForm, age: e.target.value })}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-accent)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                    {loginErrors.age && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.15rem', display: 'block' }}>{loginErrors.age}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                      Area / Ward
                    </label>
                    <select
                      value={loginForm.area}
                      onChange={e => setLoginForm({ ...loginForm, area: e.target.value })}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-accent)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        width: '100%',
                        outline: 'none',
                        height: '35px'
                      }}
                    >
                      <option value="Ward 150 - Bellandur">Ward 150 - Bellandur</option>
                      <option value="Ward 84 - Halasuru">Ward 84 - Halasuru</option>
                      <option value="Ward 174 - HSR Layout">Ward 174 - HSR Layout</option>
                      <option value="Ward 112 - Domlur">Ward 112 - Domlur</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    Aadhaar Number (12 digits)
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    maxLength="12"
                    value={loginForm.aadhaar}
                    onChange={e => setLoginForm({ ...loginForm, aadhaar: e.target.value.replace(/\D/g, '') })}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '0.2rem' }}>
                    🔒 Secure Aadhaar Verification (restricted to 18+ only).
                  </span>
                  {loginErrors.aadhaar && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.15rem', display: 'block' }}>{loginErrors.aadhaar}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    Phone Number (10 digits)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    maxLength="10"
                    value={loginForm.phone}
                    onChange={e => setLoginForm({ ...loginForm, phone: e.target.value.replace(/\D/g, '') })}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none'
                    }}
                  />
                  {loginErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.15rem', display: 'block' }}>{loginErrors.phone}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                      Gender
                    </label>
                    <select
                      value={loginForm.gender}
                      onChange={e => setLoginForm({ ...loginForm, gender: e.target.value })}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-accent)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        width: '100%',
                        outline: 'none',
                        height: '35px'
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                      Occupation
                    </label>
                    <select
                      value={loginForm.occupation}
                      onChange={e => setLoginForm({ ...loginForm, occupation: e.target.value })}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-accent)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        width: '100%',
                        outline: 'none',
                        height: '35px'
                      }}
                    >
                      <option value="Salaried Professional">Salaried Professional</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Student">Student</option>
                      <option value="Homemaker">Homemaker</option>
                      <option value="Retired">Retired</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    Home Address
                  </label>
                  <textarea
                    placeholder="Enter residential address"
                    value={loginForm.address}
                    onChange={e => setLoginForm({ ...loginForm, address: e.target.value })}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none',
                      height: '60px',
                      resize: 'none'
                    }}
                  />
                  {loginErrors.address && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.15rem', display: 'block' }}>{loginErrors.address}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={loginForm.consent}
                    onChange={e => setLoginForm({ ...loginForm, consent: e.target.checked })}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <label htmlFor="consent-check" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                    I agree to verify my identity and participate in community auditing under DPDPA-2023 guidelines. I confirm that I am 18 years of age or older.
                  </label>
                </div>
                {loginErrors.consent && <span style={{ color: '#ef4444', fontSize: '0.7rem', display: 'block' }}>{loginErrors.consent}</span>}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '0.65rem', marginTop: '0.5rem', fontWeight: 700 }}
                >
                  Send OTP Verification →
                </button>
              </form>
             </>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    OTP sent to <strong>+91 {loginForm.phone}</strong>.
                  </span>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    (For simulation, enter any code, e.g. <strong>1234</strong>)
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Enter 4-digit OTP
                  </label>
                  <input
                    type="text"
                    placeholder="• • • •"
                    maxLength="4"
                    value={otpVal}
                    onChange={e => setOtpVal(e.target.value.replace(/\D/g, ''))}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--text-primary)',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      width: '120px',
                      margin: '0 auto',
                      display: 'block',
                      letterSpacing: '0.5em',
                      outline: 'none'
                    }}
                  />
                  {otpError && <span style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.25rem', textAlign: 'center', display: 'block' }}>{otpError}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '0.65rem', fontWeight: 700 }}
                  disabled={otpLoading}
                >
                  {otpLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="spinner-mini" style={{
                        width: '14px',
                        height: '14px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></span> Verifying...
                    </div>
                  ) : (
                    'Verify & Sign In 🔓'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '0.8rem' }}
                  onClick={() => setLoginStep(1)}
                  disabled={otpLoading}
                >
                  ← Go Back
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
