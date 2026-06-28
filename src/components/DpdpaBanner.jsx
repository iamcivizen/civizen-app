import { useState, useEffect } from 'react';
import { useTranslation } from '../utils/translations.js';
import { useApp } from '../context/AppContext.jsx';

export default function DpdpaBanner() {
  const t = useTranslation();
  const { state, dispatch } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    geo: true,
    kyc: true,
    leaderboard: true
  });

  useEffect(() => {
    const consentDismissed = localStorage.getItem('civizen_dpdpa_dismissed');
    if (!consentDismissed) {
      // Delay slightly for premium UX feel
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('civizen_dpdpa_dismissed', 'true');
    localStorage.setItem('civizen_dpdpa_preferences', JSON.stringify(prefs));
    
    // Sync with AppContext if leaderboard opt-in is granted
    if (state.currentUser && !prefs.leaderboard) {
      dispatch({ type: 'REVOKE_LEADERBOARD_CONSENT' });
    }
    
    setIsVisible(false);
  };

  const handleSavePrefs = () => {
    localStorage.setItem('civizen_dpdpa_dismissed', 'true');
    localStorage.setItem('civizen_dpdpa_preferences', JSON.stringify(prefs));
    
    if (state.currentUser) {
      if (prefs.leaderboard) {
        dispatch({ type: 'GRANT_LEADERBOARD_CONSENT' });
      } else {
        dispatch({ type: 'REVOKE_LEADERBOARD_CONSENT' });
      }
    }
    
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 3rem)',
        maxWidth: '720px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        animation: 'banner-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Style injection for animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes banner-slide-up {
            from { transform: translate(-50%, 100px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          .dpdpa-switch input:checked + .dpdpa-slider {
            background: var(--accent-primary) !important;
          }
        `}} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <span style={{ fontSize: '2rem', flexShrink: 0, marginTop: '0.1rem' }}>🛡️</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 800 }}>
              {t("Privacy Notice & Consent (DPDPA-2023)")}
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
              {t("Civizen processes your data (masked Aadhaar, GPS location, and issue photos) in compliance with the Indian Digital Personal Data Protection (DPDP) Act, 2023. This is required to prevent fake reports, verify your local residency, and coordinate dispatches with officials. Faces and license plates are blurred on your device to preserve anonymity.")}
            </p>
          </div>
        </div>

        {showDetails && (
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700 }}>
              {t("Manage Processing Preferences")}
            </h5>
            
            {/* Preference 1: Geolocation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>📍 {t("GPS Coordinates Geofencing")}</span>
                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {t("Processes ticket coordinate maps to identify appropriate ward dispatch channels.")}
                </p>
              </div>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                {t("Mandatory")}
              </span>
            </div>

            {/* Preference 2: Aadhaar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>🪪 {t("Aadhaar Resident Verification")}</span>
                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {t("Validates local residency. Raw numbers are never saved locally.")}
                </p>
              </div>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                {t("Mandatory")}
              </span>
            </div>

            {/* Preference 3: Leaderboard */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>🏆 {t("Public Rankings Share")}</span>
                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {t("Displays username, earned XP, and badges on public leaderboard lists.")}
                </p>
              </div>
              <label className="dpdpa-switch" style={{
                position: 'relative',
                display: 'inline-block',
                width: '36px',
                height: '20px'
              }}>
                <input
                  type="checkbox"
                  checked={prefs.leaderboard}
                  onChange={(e) => setPrefs({ ...prefs, leaderboard: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="dpdpa-slider" style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '14px',
                    width: '14px',
                    left: prefs.leaderboard ? '19px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }} />
                </span>
              </label>
            </div>
            
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
              📩 {t("Data Protection Officer Contact: dpo@civizen.org.in. You can withdraw leaderboard consent at any time via Profile Settings.")}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.5rem 0'
            }}
          >
            {showDetails ? t("Hide Details") : t("Manage Preferences")}
          </button>
          
          {showDetails ? (
            <button
              onClick={handleSavePrefs}
              style={{
                background: 'linear-gradient(135deg, #4f6ef7, #8b5cf6)',
                border: 'none',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.2)'
              }}
            >
              {t("Save & Close")}
            </button>
          ) : (
            <button
              onClick={handleAcceptAll}
              style={{
                background: 'linear-gradient(135deg, #4f6ef7, #8b5cf6)',
                border: 'none',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.2)'
              }}
            >
              {t("Accept All Conditions")}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
