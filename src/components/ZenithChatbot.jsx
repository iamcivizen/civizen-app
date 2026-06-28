import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../utils/translations.js';
import { useApp } from '../context/AppContext.jsx';

export default function ZenithChatbot() {
  const t = useTranslation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { isLoggedIn } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am Zenith, your Civizen AI Assistant. How can I help you today? You can report an issue, check your points, or ask about ward officials.',
      time: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isLoggedIn) return null;

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate bot response
    setTimeout(() => {
      let botText = "I'm not sure about that. Try asking me how to file a complaint, check your points, or contact officials!";
      const lower = text.toLowerCase();

      if (lower.includes('report') || lower.includes('file') || lower.includes('complaint') || lower.includes('pothole') || lower.includes('leak') || lower.includes('garbage')) {
        botText = "I can help you file that complaint! I'll auto-fill details using Zenith's voice and vision analysis. Click below to go to the reporting portal.";
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: botText,
          link: '/report',
          linkLabel: '🚀 File a Complaint now',
          time: new Date()
        }]);
        return;
      } else if (lower.includes('point') || lower.includes('subsidy') || lower.includes('wallet') || lower.includes('redeem')) {
        botText = `You currently have ${state.currentUser?.points || 0} XP points in your Civizen wallet! You can link your BESCOM or BWSSB account and redeem them for electricity or water bill discounts.`;
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: botText,
          link: '/subsidies',
          linkLabel: '🎁 Go to Subsidies page',
          time: new Date()
        }]);
        return;
      } else if (lower.includes('official') || lower.includes('ward') || lower.includes('engineer') || lower.includes('corporator')) {
        botText = `Your ward is Koramangala. Your local Ward In-Charge is Suresh Kumar. He has an 89% resolution rating. You can find his contact info on the Ward Officials page.`;
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: botText,
          link: '/officials',
          linkLabel: '🏛️ View Ward Officials',
          time: new Date()
        }]);
        return;
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        botText = "Hello! How is your neighborhood today? Let me know if there are any infrastructure issues to report!";
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: botText,
        time: new Date()
      }]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend("I want to report a broken streetlight on 80 feet road.");
      }, 2500);
    }
  };

  return (
    <>
      <style>{`
        @keyframes zenithPulse {
          0% { transform: scale(1); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6); }
          100% { transform: scale(1); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
        }
        .zenith-tooltip {
          animation: zenithPulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* Floating Help Tooltip */}
      {showTooltip && !isOpen && (
        <div
          className="zenith-tooltip"
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
          }}
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            background: 'linear-gradient(135deg, #8b5cf6, #4f6ef7)',
            color: 'white',
            padding: '0.65rem 0.95rem',
            borderRadius: '12px',
            fontSize: '0.78rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <span>🤖</span>
          <span>{t("Need help? Ask Zenith AI!")}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.1rem 0.3rem',
              borderRadius: '4px',
              marginLeft: '0.25rem'
            }}
          >
            ✕
          </button>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '24px',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #4f6ef7'
            }}
          />
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #4f6ef7)',
          border: 'none',
          color: 'white',
          fontSize: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
          zIndex: 9999,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '360px',
            height: '480px',
            borderRadius: '16px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-accent)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(79, 110, 247, 0.15))',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <span style={{ fontSize: '1.75rem' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Zenith AI</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                Online · Civizen Assistant
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                marginLeft: 'auto',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >✕</button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: msg.sender === 'user' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: msg.sender === 'user' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  lineHeight: '1.4',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div>{msg.text}</div>
                {msg.link && (
                  <Link
                    to={msg.link}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'inline-block',
                      background: 'var(--accent-purple)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      textAlign: 'center',
                      marginTop: '0.25rem'
                    }}
                  >
                    {msg.linkLabel}
                  </Link>
                )}
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts */}
          <div
            style={{
              padding: '0.5rem 1rem',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              borderTop: '1px solid rgba(255, 255, 255, 0.03)',
              background: 'rgba(0,0,0,0.1)'
            }}
          >
            <button
              onClick={() => handleSend("How can I file a complaint?")}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
                borderRadius: '12px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              🎙️ File Complaint
            </button>
            <button
              onClick={() => handleSend("What is my points balance?")}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
                borderRadius: '12px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              ⭐ Check Points
            </button>
            <button
              onClick={() => handleSend("Who is my ward official?")}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
                borderRadius: '12px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              🏛️ Ward In-Charge
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-primary)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)'
            }}
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              style={{
                background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: isRecording ? 'white' : 'var(--text-muted)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}
            >
              {isRecording ? '🔴' : '🎙️'}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Zenith..."
              style={{
                flex: 1,
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-primary)',
                borderRadius: '20px',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--accent-purple)',
                border: 'none',
                color: 'white',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
