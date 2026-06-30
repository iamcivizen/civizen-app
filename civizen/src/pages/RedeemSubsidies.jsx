import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useTranslation } from '../utils/translations.js';
import './Leaderboard.css';

export default function RedeemSubsidies() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const t = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rewards';

  const [redeemingReward, setRedeemingReward] = useState(null);
  const [consumerId, setConsumerId] = useState('');
  const [upiId, setUpiId] = useState('hero@upi');
  const [bbpsStep, setBbpsStep] = useState('input'); // 'input', 'loading', 'success'
  const [selectedVoucherForModal, setSelectedVoucherForModal] = useState(null);

  const [bescomId, setBescomId] = useState(currentUser.linkedAccounts?.bescom || '');
  const [bwssbId, setBwssbId] = useState(currentUser.linkedAccounts?.bwssb || '');
  const [linkUpiId, setLinkUpiId] = useState(currentUser.linkedAccounts?.upi || 'hero@upi');
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);
  const [showLinkedModal, setShowLinkedModal] = useState(false);

  useEffect(() => {
    if (currentUser.linkedAccounts) {
      setBescomId(currentUser.linkedAccounts.bescom || '');
      setBwssbId(currentUser.linkedAccounts.bwssb || '');
      setLinkUpiId(currentUser.linkedAccounts.upi || 'hero@upi');
    } else {
      setBescomId('');
      setBwssbId('');
      setLinkUpiId('hero@upi');
    }
  }, [currentUser.linkedAccounts]);

  const handleLinkAccountsSubmit = (e) => {
    e.preventDefault();
    if (!bescomId.trim() && !bwssbId.trim()) {
      alert('Please enter at least one BESCOM or BWSSB account ID');
      return;
    }
    if (!linkUpiId.trim()) {
      alert('Please enter a valid UPI ID');
      return;
    }
    
    setIsLinkingLoading(true);
    setTimeout(() => {
      setIsLinkingLoading(false);
      dispatch({
        type: 'LINK_UTILITY_ACCOUNTS',
        payload: {
          bescom: bescomId.trim() || null,
          bwssb: bwssbId.trim() || null,
          upi: linkUpiId.trim(),
          linkedAt: new Date().toISOString(),
          holderName: 'Suresh Kumar'
        }
      });
      setShowLinkedModal(true);
    }, 1800);
  };

  const handleUnlink = () => {
    if (window.confirm('Are you sure you want to unlink your utility accounts?')) {
      dispatch({ type: 'UNLINK_UTILITY_ACCOUNTS' });
    }
  };

  const rewardsList = [
    { id: 'r1', label: 'Namma Metro Pass', desc: 'Get 10% discount on Namma Metro recharges and tickets.', cost: 300, icon: '🚇' },
    { id: 'r2', label: 'BESCOM Utility Subsidy', desc: 'Rs. 50 bill subsidy applied to your electricity account.', cost: 500, icon: '⚡', isUpibbps: true, biller: 'BESCOM Bengaluru' },
    { id: 'r3', label: 'BBMP Smart Parking Pass', desc: '2 hours of complimentary smart parking in city center bays.', cost: 200, icon: '🅿️' },
    { id: 'r4', label: 'BWSSB Water Subsidy', desc: 'Rs. 40 rebate applied to your monthly water utility bill.', cost: 400, icon: '🚰', isUpibbps: true, biller: 'BWSSB Bengaluru' },
    { id: 'r5', label: 'Civic Compost Starter Kit', desc: 'Get a organic waste composting bin delivered to your door.', cost: 150, icon: '🌱' },
  ];

  const handleRedeem = (reward) => {
    if (currentUser.points >= reward.cost) {
      if (reward.isUpibbps) {
        setRedeemingReward(reward);
        setBbpsStep('input');
      } else {
        dispatch({
          type: 'REDEEM_POINTS',
          payload: { cost: reward.cost, rewardLabel: reward.label }
        });
      }
    } else {
      alert(`Insufficient points! You need ${reward.cost - currentUser.points} more points to redeem this reward.`);
    }
  };

  return (
    <div className="page-container leaderboard-page">
      <div className="page-header">
        <h1 className="page-title">{t("Redeem Civic Subsidies")}</h1>
        <p className="page-subtitle">{t("Redeem earned civic points directly as deductions/coupons on utility bills (BESCOM, BWSSB) or Metro passes")}</p>
      </div>

      <div className="rewards-hub-container" style={{ marginTop: '1rem' }}>
        <div className="rewards-balance-card">
          <div>
            <span className="rewards-balance-title">Your Wallet Balance</span>
            <h2 className="rewards-balance-value">
              ⭐ {currentUser.points.toLocaleString()} <span>points (XP)</span>
            </h2>
          </div>
          <div className="points-badge-status">
            Level {currentUser.level || 3} Active Citizen
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="lb-tabs" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          <button
            className={`lb-tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: 'rewards' })}
          >
            🎁 {t("Available Rewards")}
          </button>
          <button
            className={`lb-tab ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: 'link' })}
          >
            🔗 {t("Link Utility Accounts")}
          </button>
        </div>

        {activeTab === 'rewards' ? (
          <div className="rewards-layout">
          {/* Rewards Grid */}
          <div className="rewards-left-col">
            <h3 className="rewards-section-title">
              <span>{t("Available Municipal Rewards")}</span>
              <span className="rewards-section-subtitle">
                {t("Redeem points directly for rebates & vouchers")}
              </span>
            </h3>
            
            <div className="rewards-grid">
              {rewardsList.map(reward => {
                const canAfford = currentUser.points >= reward.cost;
                return (
                  <div key={reward.id} className="reward-item-card">
                    <div className="reward-item-info">
                      <div className="reward-item-icon">
                        {reward.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h4 className="reward-card-title" style={{ margin: 0 }}>{reward.label}</h4>
                          {reward.isUpibbps && (
                            <span className="bbps-badge text-xxs font-bold" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                              ⚡ {t("UPI & BBPS Linked")}
                            </span>
                          )}
                        </div>
                        <p className="reward-card-desc" style={{ marginTop: '0.25rem' }}>{reward.desc}</p>
                      </div>
                    </div>
                    
                    <div className="reward-item-action">
                      <span className="reward-item-cost">⚡ {reward.cost} pts</span>
                      <button
                        className={`btn ${canAfford ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => canAfford && handleRedeem(reward)}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Availed Coupons & Transaction History */}
          <div className="rewards-right-col">
            <h3 className="rewards-section-title">
              <span>🎟️ {t("Availed Coupons")}</span>
            </h3>
            
            <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-accent)', padding: '1.25rem', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{t("Transaction History")}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>3 {t("Coupons")}</span>
              </h4>

              {/* Transaction list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                
                {/* Coupon 1 */}
                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.4rem' }}>⚡</span>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)' }}>BESCOM Utility rebate</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>2026-06-25 • Rs. 50</div>
                      </div>
                    </div>
                    <span className="badge text-xxs font-bold" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      Applied
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px dashed var(--border-primary)', paddingTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--accent-purple)', fontWeight: 700, background: 'rgba(139, 92, 246, 0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      BES-CV-8294
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>⭐ 500 pts</span>
                  </div>
                </div>

                {/* Coupon 2 */}
                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.4rem' }}>🚇</span>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)' }}>Namma Metro Pass</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>2026-06-20 • 10% Off</div>
                      </div>
                    </div>
                    <span className="badge text-xxs font-bold" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      Active
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px dashed var(--border-primary)', paddingTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--accent-purple)', fontWeight: 700, background: 'rgba(139, 92, 246, 0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      METRO-DISC-904
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>⭐ 300 pts</span>
                  </div>
                </div>

                {/* Coupon 3 */}
                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-primary)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.4rem' }}>🅿️</span>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-primary)' }}>BBMP Smart Parking</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>2026-06-15 • 2 Hours</div>
                      </div>
                    </div>
                    <span className="badge text-xxs font-bold" style={{ background: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      Expired
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px dashed var(--border-primary)', paddingTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 500, background: 'rgba(255, 255, 255, 0.04)', padding: '0.15rem 0.4rem', borderRadius: '4px', textDecoration: 'line-through' }}>
                      PK-SMART-332
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>⭐ 200 pts</span>
                  </div>
                </div>

              </div>

              {/* Total Stats summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', padding: '0.85rem 1rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2px' }}>Total Redeemed</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.15rem' }}>⭐ 1,000 pts</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2px' }}>Est. Savings</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#34d399', marginTop: '0.15rem' }}>₹ 110.00</div>
                </div>
              </div>
            </div>
          </div>

        </div>
        ) : (
          /* Link Accounts Tab Contents */
          <div className="rewards-layout">
            {/* Linking Form */}
            <div className="rewards-left-col">
              <h3 className="rewards-section-title">
                <span>🔗 {t("Link BBPS Utility Credentials")}</span>
                <span className="rewards-section-subtitle">
                  {t("Connect your utility profiles to enable automated point deduction & cashbacks")}
                </span>
              </h3>
              
              <form onSubmit={handleLinkAccountsSubmit} className="reward-item-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1.25rem', padding: '1.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      ⚡ {t("BESCOM Consumer Account ID")} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({t("10 digits")})</span>
                    </label>
                    <input 
                      type="text" 
                      maxLength="10"
                      className="input-field" 
                      value={bescomId}
                      onChange={(e) => setBescomId(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1029485736"
                      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="text-xs font-semibold text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      🚰 {t("BWSSB Water RR Number")} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({t("e.g. RR-XXXXXX")})</span>
                    </label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={bwssbId}
                      onChange={(e) => setBwssbId(e.target.value)}
                      placeholder="e.g. RR-N483921"
                      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="text-xs font-semibold text-secondary">
                      💳 {t("UPI ID for Direct Cashback")}
                    </label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={linkUpiId}
                      onChange={(e) => setLinkUpiId(e.target.value)}
                      placeholder="e.g. username@upi"
                      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem', borderRadius: '8px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="bbps-brand-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <span className="text-xxs text-muted font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>🛡️ NPCI Secured</span>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.05em' }}>BHARAT BILLPAY</span>
                </div>

                <button 
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLinkingLoading || (!bescomId.trim() && !bwssbId.trim())}
                  style={{ justifyContent: 'center', padding: '0.75rem' }}
                >
                  {isLinkingLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span>Verifying via NPCI Hub...</span>
                    </div>
                  ) : (
                    <span>🔌 {t("Link Utility Accounts")}</span>
                  )}
                </button>
              </form>
            </div>

            {/* Connection Status Panel */}
            <div className="my-vouchers-section">
              <h3 className="rewards-section-title">
                <span>🟢 {t("Connection Status")}</span>
              </h3>
              
              {currentUser.linkedAccounts ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(6, 214, 160, 0.08)', border: '1px solid rgba(6, 214, 160, 0.25)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>✅</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t("Accounts Connected")}</strong>
                    </div>
                    <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                      BBPS verification successful for holder <strong>Suresh Kumar</strong>. Cashbacks will be automatically credited to your UPI account.
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                    {currentUser.linkedAccounts.bescom && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
                        <span className="text-muted">⚡ BESCOM ID:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{currentUser.linkedAccounts.bescom}</strong>
                      </div>
                    )}
                    {currentUser.linkedAccounts.bwssb && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
                        <span className="text-muted">🚰 BWSSB RR No:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{currentUser.linkedAccounts.bwssb}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">💳 UPI ID:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{currentUser.linkedAccounts.upi}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={handleUnlink}
                    className="btn btn-secondary w-full"
                    style={{ justifyContent: 'center', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                  >
                    🗑️ {t("Unlink Accounts")}
                  </button>
                </div>
              ) : (
                <div className="vouchers-empty" style={{ padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔌</div>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>No linked utility accounts found. Enter your BESCOM/BWSSB Consumer ID to link your profile with BBPS.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BBPS Linking Modal */}
      {redeemingReward && (
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
          <div className="bbps-modal-content" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '460px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.2)',
            animation: 'dropdown-in 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div className="bbps-modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-primary)',
              paddingBottom: '0.75rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🇮🇳 {t("Link Utility Account")}
              </h3>
              <button 
                onClick={() => {
                  setRedeemingReward(null);
                  setBbpsStep('input');
                  setConsumerId('');
                }}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            {bbpsStep === 'input' && (
              <div className="bbps-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(79, 110, 247, 0.08)', border: '1px solid rgba(79, 110, 247, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.75rem' }}>{redeemingReward.icon}</span>
                  <div>
                    <strong className="text-sm text-primary" style={{ display: 'block' }}>{redeemingReward.label}</strong>
                    <span className="text-xs text-muted" style={{ display: 'block' }}>Cost: {redeemingReward.cost} XP (Wallet Bal: {currentUser.points} XP)</span>
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label className="text-xs font-semibold text-secondary">{t("Consumer Account Number")} ({redeemingReward.icon === '⚡' ? 'BESCOM 10-Digit ID' : 'BWSSB RR Number'})</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={consumerId}
                    onChange={(e) => setConsumerId(e.target.value)}
                    placeholder={redeemingReward.icon === '⚡' ? 'e.g. 1029485736' : 'e.g. RR-N483921'}
                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem', borderRadius: '8px' }}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label className="text-xs font-semibold text-secondary">{t("UPI ID for Cashback")}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@upi"
                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem', borderRadius: '8px' }}
                  />
                </div>

                <div className="bbps-brand-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', background: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <span className="text-xxs text-muted font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>🛡️ NPCI Secured</span>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.05em' }}>BHARAT BILLPAY</span>
                </div>

                <button 
                  className="btn btn-primary w-full"
                  disabled={!consumerId.trim() || !upiId.trim()}
                  onClick={() => {
                    setBbpsStep('loading');
                    setTimeout(() => {
                      setBbpsStep('success');
                      dispatch({
                        type: 'REDEEM_POINTS',
                        payload: { 
                          cost: redeemingReward.cost, 
                          rewardLabel: redeemingReward.label,
                          details: {
                            upiId,
                            consumerId,
                            isUpibbps: true,
                            biller: redeemingReward.biller,
                            accountName: 'Suresh Kumar'
                          }
                        }
                      });
                    }, 1800);
                  }}
                  style={{ justifyContent: 'center', padding: '0.65rem' }}
                >
                  ⚡ {t("Verify & Link")}
                </button>
              </div>
            )}

            {bbpsStep === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', gap: '1rem', textAlign: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <div>
                  <h4 className="font-semibold text-sm text-primary" style={{ margin: 0 }}>Connecting BBPS Hub...</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>Querying account records for {consumerId} and validating UPI handle...</p>
                </div>
              </div>
            )}

            {bbpsStep === 'success' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                  <div style={{ fontSize: '2.5rem' }}>✅</div>
                  <h4 className="font-semibold text-base text-primary" style={{ margin: 0 }}>Subsidy Linked!</h4>
                  <p className="text-xs text-muted" style={{ margin: 0 }}>Account verified for <strong>Suresh Kumar</strong>. Deduction voucher of {redeemingReward.label.includes('50') ? 'Rs. 50' : 'Rs. 40'} is now linked to your biller profile via NPCI/BBPS.</p>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid var(--border-accent)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Biller:</span><strong>{redeemingReward.biller}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Consumer ID:</span><strong>{consumerId}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">UPI Cashback Handle:</span><strong>{upiId}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Status:</span><span style={{ color: '#06d6a0', fontWeight: 700 }}>Auto-applied to next bill</span></div>
                </div>

                <button 
                  className="btn btn-primary w-full"
                  onClick={() => {
                    setRedeemingReward(null);
                    setBbpsStep('input');
                    setConsumerId('');
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coupon Details Modal */}
      {selectedVoucherForModal && (
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
          <div className="bbps-modal-content" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '420px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'dropdown-in 0.3s ease'
          }}>
            <div className="bbps-modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-primary)',
              paddingBottom: '0.75rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                🎫 {t("Utility Bill Deduction Coupon")}
              </h3>
              <button 
                onClick={() => setSelectedVoucherForModal(null)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <div style={{ border: '2px dashed var(--border-accent)', borderRadius: '12px', padding: '1.5rem', background: '#0b0f19', width: '100%', textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>BHARAT BILL PAYMENT SYSTEM</div>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: 'white' }}>{selectedVoucherForModal.rewardLabel}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06d6a0', margin: '0.5rem 0' }}>
                  {selectedVoucherForModal.rewardLabel.includes('50') ? 'Rs. 50.00 Deduction' : 'Rs. 40.00 Deduction'}
                </div>
                
                <div style={{ borderTop: '1px dashed #1e293b', margin: '1rem 0' }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Biller:</span><strong style={{ color: 'white' }}>{selectedVoucherForModal.biller}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Consumer ID:</span><strong style={{ color: 'white' }}>{selectedVoucherForModal.consumerId}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Account Holder:</span><strong style={{ color: 'white' }}>Suresh Kumar</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>UPI Linked Ref:</span><strong style={{ color: 'white' }}>{selectedVoucherForModal.upiId}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Voucher Code:</span><strong style={{ color: 'var(--accent-secondary)' }}>{selectedVoucherForModal.code}</strong></div>
                </div>

                <div style={{ borderTop: '1px dashed #1e293b', margin: '1rem 0' }}></div>
                
                {/* Simulated QR Code */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '6px', display: 'inline-block' }}>
                    <div style={{ width: '80px', height: '80px', background: '#000', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', padding: '2px' }}>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#000' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#000' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#000' }}></div>
                      <div style={{ background: '#000' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#000' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#000' }}></div>
                      <div style={{ background: '#fff' }}></div>
                      <div style={{ background: '#000' }}></div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.25rem' }}>REF: {selectedVoucherForModal.code}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Connection Success Modal */}
      {showLinkedModal && (
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
          <div className="bbps-modal-content" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '420px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(6, 214, 160, 0.2)',
            animation: 'dropdown-in 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h4 className="font-semibold text-base text-primary" style={{ margin: 0, fontSize: '1.25rem' }}>Verification Successful!</h4>
                <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                  Your utility accounts have been verified via BBPS (Bharat BillPay) and linked to your citizen profile. You are now eligible for auto-applied cashbacks and deductions.
                </p>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid var(--border-accent)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {currentUser.linkedAccounts?.bescom && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">BESCOM ID:</span><strong>{currentUser.linkedAccounts.bescom}</strong></div>}
                {currentUser.linkedAccounts?.bwssb && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">BWSSB RR No:</span><strong>{currentUser.linkedAccounts.bwssb}</strong></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">UPI Handle:</span><strong>{currentUser.linkedAccounts?.upi}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Holder:</span><strong>Suresh Kumar</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Verification Status:</span><span style={{ color: '#06d6a0', fontWeight: 700 }}>VERIFIED VIA BBPS</span></div>
              </div>

              <button 
                className="btn btn-primary w-full"
                onClick={() => setShowLinkedModal(false)}
                style={{ justifyContent: 'center' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
