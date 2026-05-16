import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail, Moon, RotateCcw, Sun } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { authApi } from '@/features/auth/services/authApi';
import { useTheme } from '@/shared/context/ThemeContext';
import { getApiErrorMessage } from '@/shared/lib/apiError';

interface CheckInboxLocationState {
  email?: string;
}

export default function CheckInboxPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const startCookieSession = useAuthStore((state) => state.startCookieSession);
  const { theme, toggleTheme } = useTheme();
  const [imgError, setImgError] = useState(false);
  const email = useMemo(() => {
    const stateEmail = (location.state as CheckInboxLocationState | null)?.email;
    const queryEmail = new URLSearchParams(location.search).get('email');
    return stateEmail || queryEmail || sessionStorage.getItem('signup-email') || '';
  }, [location.search, location.state]);
  const isDark = theme === 'dark';

  const colors = useMemo(() => ({
    bg: isDark ? '#0e0e0e' : '#f5f3ef',
    card: isDark ? '#1c1c1c' : '#ffffff',
    cardBorder: isDark ? '#2e2e2e' : '#e8e4de',
    footerBg: isDark ? '#161616' : '#faf9f7',
    labelText: isDark ? '#888888' : '#525252',
    mutedText: isDark ? '#666666' : '#8a8a8a',
    bodyText: isDark ? '#aaaaaa' : '#5a5a5a',
    headingText: isDark ? '#f0f0f0' : '#1a1a1a',
    divider: isDark ? '#272727' : '#ede9e4',
    btnBg: isDark ? '#f0f0f0' : '#1a1a1a',
    btnText: isDark ? '#0e0e0e' : '#ffffff',
    btnHover: isDark ? '#ffffff' : '#2a2a2a',
    footerText: isDark ? '#555555' : '#9a9a9a',
  }), [isDark]);

  const resendMutation = useMutation({
    mutationFn: authApi.resendVerification,
  });

  const signupStatusQuery = useQuery({
    queryKey: ['signup-status', email],
    queryFn: () => authApi.signupStatus(email),
    enabled: Boolean(email),
    refetchInterval: (query) => query.state.data?.status === 'verified' ? false : 2500,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (email) sessionStorage.setItem('signup-email', email);
  }, [email]);

  useEffect(() => {
    if (signupStatusQuery.data?.status !== 'verified') return;

    const isCompleted = Boolean(signupStatusQuery.data.onboarding_completed);
    startCookieSession(isCompleted);
    navigate(isCompleted ? '/dashboard' : '/onboarding', { replace: true });
  }, [navigate, signupStatusQuery.data, startCookieSession]);

  const canResend = Boolean(email) && !resendMutation.isPending;
  const isVerified = signupStatusQuery.data?.status === 'verified';

  const statusBoxStyle: CSSProperties = {
    borderRadius: 14,
    padding: '12px 14px',
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .check-inbox-card {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          max-width: 520px;
        }
        .bg-texture {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.018)'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.018)'} 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bg-vignette {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, transparent 40%, ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'} 100%);
        }
        .theme-toggle {
          position: fixed; top: 24px; right: 24px; z-index: 50;
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid ${colors.cardBorder};
          background: ${isDark ? 'rgba(28,28,28,0.9)' : 'rgba(255,255,255,0.9)'};
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: ${colors.mutedText};
          transition: color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'};
        }
        .theme-toggle:hover { color: ${colors.headingText}; box-shadow: 0 4px 16px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.12)'}; }
        .btn-primary {
          width: 100%; background: ${colors.btnBg}; color: ${colors.btnText};
          border: none; border-radius: 50px; padding: 15px 24px;
          font-size: 13.5px; font-family: 'Inter', sans-serif; font-weight: 500;
          letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer;
          transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) {
          background: ${colors.btnHover};
          box-shadow: 0 8px 24px ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.14)'};
          transform: translateY(-1px);
        }
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
        .link-muted {
          color: ${colors.mutedText};
          text-decoration: none;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .link-muted:hover { color: ${colors.headingText}; }
        .spin { animation: spin 0.75s linear infinite; }
      `}</style>

      <div className="bg-texture" />
      <div className="bg-vignette" />

      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <div className="check-inbox-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 24,
          boxShadow: isDark
            ? '0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)'
            : '0 32px 64px -16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '42px 40px 34px',
            textAlign: 'center',
            borderBottom: `1px solid ${colors.divider}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              {!imgError ? (
                <img
                  src="/logo.png"
                  alt="Doers"
                  style={{
                    height: 108,
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
                  fontSize: '2.2rem',
                  fontWeight: 500,
                  color: colors.headingText,
                }}>
                  Doers
                </div>
              )}
            </div>

            <div style={{ width: 40, height: 1, background: isDark ? '#333' : '#ddd9d3', margin: '0 auto 18px' }} />

            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              border: `1px solid ${colors.cardBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: colors.headingText,
              background: isDark ? '#151515' : '#faf9f7',
            }}>
              <Mail size={22} />
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26,
              fontWeight: 500,
              color: colors.headingText,
              margin: '0 0 10px',
            }}>
              Check your inbox
            </h1>

            <p style={{
              color: colors.bodyText,
              fontSize: 13,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {email ? (
                <>We sent a verification link to <strong style={{ color: colors.headingText, fontWeight: 600 }}>{email}</strong>.</>
              ) : (
                'We sent a verification link to your registered email address.'
              )}
            </p>
          </div>

          <div style={{ padding: '30px 40px 28px' }}>
            {resendMutation.isSuccess ? (
              <div style={{
                ...statusBoxStyle,
                color: '#3a9a5a',
                background: isDark ? 'rgba(58,154,90,0.12)' : '#eef8f1',
                border: `1px solid ${isDark ? 'rgba(58,154,90,0.28)' : '#ccebd4'}`,
              }}>
                <CheckCircle2 size={15} />
                <span>Verification email sent again.</span>
              </div>
            ) : null}

            {email && !isVerified ? (
              <div style={{
                ...statusBoxStyle,
                color: colors.bodyText,
                background: isDark ? 'rgba(255,255,255,0.04)' : '#faf9f7',
                border: `1px solid ${colors.divider}`,
              }}>
                <LoaderCircle className="spin" size={15} />
                <span>Listening for verification. This page will continue automatically.</span>
              </div>
            ) : null}

            {signupStatusQuery.error ? (
              <div style={{
                ...statusBoxStyle,
                color: isDark ? '#f08070' : '#b94a3a',
                background: isDark ? 'rgba(180,60,40,0.12)' : '#fdf2f0',
                border: `1px solid ${isDark ? 'rgba(180,60,40,0.3)' : '#f5cdc8'}`,
              }}>
                <span>{getApiErrorMessage(signupStatusQuery.error, 'Could not check verification status.')}</span>
              </div>
            ) : null}

            {resendMutation.error ? (
              <div style={{
                ...statusBoxStyle,
                color: isDark ? '#f08070' : '#b94a3a',
                background: isDark ? 'rgba(180,60,40,0.12)' : '#fdf2f0',
                border: `1px solid ${isDark ? 'rgba(180,60,40,0.3)' : '#f5cdc8'}`,
              }}>
                <span>{getApiErrorMessage(resendMutation.error, 'Could not resend verification email.')}</span>
              </div>
            ) : null}

            <button
              type="button"
              className="btn-primary"
              disabled={!canResend}
              onClick={() => email && resendMutation.mutate(email)}
            >
              {resendMutation.isPending ? (
                <>
                  <LoaderCircle className="spin" size={14} />
                  Sending
                </>
              ) : (
                <>
                  <RotateCcw size={14} />
                  Resend Email
                </>
              )}
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              margin: '22px 0 16px',
            }}>
              <div style={{ flex: 1, height: 1, background: colors.divider }} />
              <span style={{
                fontSize: 9,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: isDark ? '#333' : '#ccc8c2',
              }}>
                or
              </span>
              <div style={{ flex: 1, height: 1, background: colors.divider }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" className="link-muted">
                <ArrowLeft size={13} />
                Back to sign in
              </Link>
            </div>
          </div>

          <div style={{
            background: colors.footerBg,
            borderTop: `1px solid ${colors.divider}`,
            padding: '16px 40px 20px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '5px 16px',
              fontSize: 10,
              fontFamily: 'monospace',
              color: colors.footerText,
            }}>
              <span>Secure verification</span>
              <span>Owner access</span>
              <span>Trial pending</span>
              <span>Console ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
