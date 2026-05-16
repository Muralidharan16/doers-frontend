import { useState, useEffect } from 'react';
import { useTheme } from '@/shared/context/ThemeContext';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';

export default function VerifySuccessPage() {
  const { theme, toggleTheme } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0e0e0e' : '#f5f3ef',
    card: isDark ? '#1c1c1c' : '#ffffff',
    cardBorder: isDark ? '#2e2e2e' : '#e8e4de',
    footerBg: isDark ? '#161616' : '#faf9f7',
    inputBorder: isDark ? '#2e2e2e' : '#e8e4de',
    inputFocus: isDark ? '#444444' : '#a8a29e',
    inputText: isDark ? '#f0f0f0' : '#1a1a1a',
    labelText: isDark ? '#888888' : '#525252',
    mutedText: isDark ? '#666666' : '#8a8a8a',
    bodyText: isDark ? '#aaaaaa' : '#5a5a5a',
    headingText: isDark ? '#f0f0f0' : '#1a1a1a',
    divider: isDark ? '#272727' : '#ede9e4',
    btnBg: isDark ? '#f0f0f0' : '#1a1a1a',
    btnText: isDark ? '#0e0e0e' : '#ffffff',
    btnHover: isDark ? '#ffffff' : '#2a2a2a',
    footerText: isDark ? '#555555' : '#9a9a9a',
    successGreen: '#10b981',
    syncDot: isDark ? '#e0e0e0' : '#1a1a1a',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkmark {
          0% { 
            opacity: 0;
            transform: scale(0.5) rotate(-45deg);
          }
          50% { opacity: 1; }
          100% { 
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes syncPulse {
          0%, 100% { opacity: 0.15; transform: scale(0.75); }
          50%       { opacity: 1;    transform: scale(1.25); }
        }
        @keyframes ping {
          0%        { transform: scale(1);   opacity: 0.5; }
          75%, 100% { transform: scale(2.4); opacity: 0;   }
        }

        .verify-card {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          max-width: 520px;
        }

        /* Subtle warm grid background */
        .bg-texture {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.018)'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.018)'} 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bg-vignette {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center,
            transparent 40%,
            ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'} 100%
          );
        }

        /* Button styles */
        .btn-primary {
          width: 100%;
          padding: 16px 24px;
          background: ${colors.btnBg};
          color: ${colors.btnText};
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
          box-shadow: 0 8px 24px ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.08)'};
          display: flex;
          align-items: center;
          justify-content: 'center';
          gap: 8px;
        }
        .btn-primary:hover:not(:disabled) {
          background: ${colors.btnHover};
          box-shadow: 0 8px 24px ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.14)'};
          transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0) scale(0.985);
          box-shadow: none;
        }

        /* Links */
        .link-muted {
          font-size: 12px;
          color: ${colors.mutedText};
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 400;
        }
        .link-muted:hover { color: ${colors.headingText}; }

        /* Theme toggle */
        .theme-toggle {
          position: fixed; top: 24px; right: 24px; z-index: 50;
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid ${colors.cardBorder};
          background: ${isDark ? 'rgba(28,28,28,0.9)' : 'rgba(255,255,255,0.9)'};
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: ${colors.mutedText};
          transition: color 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 2px 8px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'};
        }
        .theme-toggle:hover {
          color: ${colors.headingText};
          box-shadow: 0 4px 16px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.12)'};
        }

        .checkmark-icon {
          animation: checkmark 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Sync dots */
        .sync-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: ${colors.syncDot};
          animation: syncPulse 1.8s ease-in-out infinite;
        }
        .sync-dot:nth-child(2) { animation-delay: 0.25s; }
        .sync-dot:nth-child(3) { animation-delay: 0.5s; }
      `}</style>

      {/* Background texture */}
      <div className="bg-texture" />
      <div className="bg-vignette" />

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Main Card */}
      <div className="verify-card" style={{
        backgroundColor: colors.card,
        borderRadius: '16px',
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: isDark
          ? '0 32px 64px -16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.08)'
          : '0 32px 64px -16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        transition: 'box-shadow 0.4s ease',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '48px 40px 32px',
          textAlign: 'center',
          borderBottom: `1px solid ${colors.divider}`,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            {!imgError ? (
              <img
                src="/logo.png"
                alt="Doers"
                style={{
                  height: 130,
                  width: 'auto',
                  objectFit: 'contain',
                  filter: isDark ? 'invert(1) brightness(0.88)' : 'none',
                  transition: 'filter 0.4s ease',
                }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '2.4rem',
                fontWeight: 500,
                color: colors.headingText,
                letterSpacing: '-0.02em',
              }}>
                Doers
              </div>
            )}
          </div>

          {/* Thin divider line */}
          <div style={{
            width: 40,
            height: 1,
            background: isDark ? '#333' : '#ddd9d3',
            margin: '0 auto 20px',
          }} />

          {/* Tagline */}
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 13,
            fontWeight: 400,
            fontStyle: 'italic',
            color: colors.bodyText,
            margin: 0,
            letterSpacing: '0.02em',
            lineHeight: 1.7,
          }}>
            Secure access for studios & athletic facilities
          </p>
        </div>

        {/* ── Body Content ── */}
        <div style={{
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          {/* Success Icon */}
          <div style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div className="checkmark-icon" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2
                size={64}
                color={colors.successGreen}
                strokeWidth={1.5}
                style={{ filter: 'drop-shadow(0 8px 16px rgba(16, 185, 129, 0.15))' }}
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2rem',
            fontWeight: 500,
            color: colors.headingText,
            margin: '0 0 12px',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}>
            Email Verified!
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 14,
            fontWeight: 400,
            color: colors.bodyText,
            margin: '0 0 28px',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}>
            Your email has been successfully verified. You can now continue with your setup and unlock all features of your account.
          </p>

          {/* Success Badge */}
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
            borderRadius: '8px',
            marginBottom: 28,
            fontSize: 12,
            fontWeight: 600,
            color: colors.successGreen,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            ✓ Account Ready
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '20px 40px',
          borderTop: `1px solid ${colors.divider}`,
          backgroundColor: colors.footerBg,
          textAlign: 'center',
          fontSize: 11,
          color: colors.footerText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          letterSpacing: '0.02em',
        }}>
          <span className="sync-dot" />
          <span className="sync-dot" />
          <span className="sync-dot" />
          <span style={{ marginLeft: 8 }}>Last updated: {currentTime}</span>
        </div>
      </div>
    </div>
  );
}
