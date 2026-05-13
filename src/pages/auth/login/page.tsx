import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth';
import { useTheme } from '@/shared/context/ThemeContext';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [imgError, setImgError] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);
  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0e0e0e' : '#f5f3ef',
    card: isDark ? '#1c1c1c' : '#ffffff',
    cardBorder: isDark ? '#2e2e2e' : '#e8e4de',
    footerBg: isDark ? '#161616' : '#faf9f7',
    inputBg: isDark ? '#111111' : '#ffffff',
    inputBorder: isDark ? '#2e2e2e' : '#e8e4de',
    inputFocus: isDark ? '#444444' : '#a8a29e',
    inputText: isDark ? '#f0f0f0' : '#1a1a1a',
    inputPlaceholder: isDark ? '#3a3a3a' : '#bdb8b2',
    labelText: isDark ? '#888888' : '#525252',
    mutedText: isDark ? '#666666' : '#8a8a8a',
    bodyText: isDark ? '#aaaaaa' : '#5a5a5a',
    headingText: isDark ? '#f0f0f0' : '#1a1a1a',
    divider: isDark ? '#272727' : '#ede9e4',
    btnBg: isDark ? '#f0f0f0' : '#1a1a1a',
    btnText: isDark ? '#0e0e0e' : '#ffffff',
    btnHover: isDark ? '#ffffff' : '#2a2a2a',
    footerText: isDark ? '#555555' : '#9a9a9a',
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
        @keyframes syncPulse {
          0%, 100% { opacity: 0.15; transform: scale(0.75); }
          50%       { opacity: 1;    transform: scale(1.25); }
        }
        @keyframes ping {
          0%        { transform: scale(1);   opacity: 0.5; }
          75%, 100% { transform: scale(2.4); opacity: 0;   }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-card {
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

        /* Input styles */
        .input-luxury {
          width: 100%;
          padding: 15px 18px;
          background: ${colors.inputBg};
          border: 1px solid ${colors.inputBorder};
          border-radius: 12px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          color: ${colors.inputText};
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          letter-spacing: 0.01em;
        }
        .input-luxury::placeholder {
          color: ${colors.inputPlaceholder};
          font-weight: 300;
        }
        .input-luxury:hover {
          border-color: ${isDark ? '#3a3a3a' : '#ccc8c2'};
        }
        .input-luxury:focus {
          border-color: ${colors.inputFocus};
          box-shadow: 0 0 0 4px ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'};
        }
        .input-luxury.has-error {
          border-color: #d97b6b;
          box-shadow: 0 0 0 4px rgba(217,123,107,0.1);
        }

        /* Button */
        .btn-primary {
          width: 100%;
          background: ${colors.btnBg};
          color: ${colors.btnText};
          border: none;
          border-radius: 50px;
          padding: 15px 24px;
          font-size: 13.5px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
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
        .btn-primary:disabled {
          opacity: 0.35;
          cursor: not-allowed;
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

        .link-bold {
          color: ${colors.headingText};
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid ${isDark ? '#3a3a3a' : '#d4d0ca'};
          padding-bottom: 1px;
          transition: border-color 0.2s, color 0.2s;
        }
        .link-bold:hover {
          border-color: ${colors.headingText};
        }

        /* Animations */
        .spin { animation: spin 0.75s linear infinite; }
        .sync-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: ${colors.syncDot};
          animation: syncPulse 1.8s ease-in-out infinite;
        }
        .sync-dot:nth-child(2) { animation-delay: 0.25s; }
        .sync-dot:nth-child(3) { animation-delay: 0.5s; }
        .status-ping {
          position: absolute; inset: 0;
          border-radius: 50%;
          background: #10b981;
          opacity: 0.5;
          animation: ping 2s ease-in-out infinite;
        }

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
      `}</style>

      {/* Background texture */}
      <div className="bg-texture" />
      <div className="bg-vignette" />

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Card */}
      <div className="login-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 24,
          boxShadow: isDark
            ? '0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)'
            : '0 32px 64px -16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          transition: 'box-shadow 0.4s ease',
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

          {/* ── Form ── */}
          <div style={{ padding: '32px 40px 28px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="email" style={{
                  display: 'block',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: colors.labelText,
                  marginBottom: 8,
                }}>
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="alex@doers.studio"
                  autoComplete="email"
                  className={`input-luxury${errors.email ? ' has-error' : ''}`}
                  {...register('email')}
                />
                {errors.email && (
                  <p style={{ fontSize: 11, color: '#c0695a', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⚠ {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label htmlFor="password" style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: colors.labelText,
                  }}>
                    Password
                  </label>
                  <a href="/forgot-password" className="link-muted">Forgot password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="··········"
                    autoComplete="current-password"
                    className={`input-luxury${errors.password ? ' has-error' : ''}`}
                    style={{ paddingRight: 52 }}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: 16, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: colors.mutedText, display: 'flex', alignItems: 'center', padding: 0,
                      transition: 'color 0.2s',
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ fontSize: 11, color: '#c0695a', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⚠ {errors.password.message}
                  </p>
                )}
              </div>

              {/* API error */}
              {error && (
                <div style={{
                  fontSize: 12, lineHeight: 1.5,
                  color: isDark ? '#f08070' : '#b94a3a',
                  background: isDark ? 'rgba(180,60,40,0.12)' : '#fdf2f0',
                  border: `1px solid ${isDark ? 'rgba(180,60,40,0.3)' : '#f5cdc8'}`,
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                }}>
                  {error.message || 'Authentication failed. Please try again.'}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? (
                  <>
                    <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                    </svg>
                    Authenticating…
                  </>
                ) : 'Sign in to Console'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0 14px' }}>
                <div style={{ flex: 1, height: 1, background: colors.divider }} />
                <span style={{
                  fontSize: 9, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  color: isDark ? '#333' : '#ccc8c2',
                }}>or</span>
                <div style={{ flex: 1, height: 1, background: colors.divider }} />
              </div>

              {/* Sign up */}
              <p style={{ textAlign: 'center', fontSize: 13, color: colors.mutedText, margin: 0, fontWeight: 300 }}>
                New to Doers?{' '}
                <a href="/signup" className="link-bold">Create an account</a>
              </p>
            </form>
          </div>

          {/* ── Footer ── */}
          <div style={{
            background: colors.footerBg,
            borderTop: `1px solid ${colors.divider}`,
            padding: '18px 40px 22px',
          }}>
            {/* Row 1 */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap',
              gap: 10, marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', width: 8, height: 8, display: 'flex' }}>
                  <div className="status-ping" />
                  <div style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.04em', color: colors.footerText }}>
                  Systems Online
                </span>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center', marginLeft: 4 }}>
                  <div className="sync-dot" />
                  <div className="sync-dot" />
                  <div className="sync-dot" />
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 10, fontFamily: 'monospace', color: colors.footerText,
              }}>
                <span>🔒 AES‑256</span>
                <div style={{ width: 1, height: 10, background: colors.divider }} />
                <span>✦ 3 biometric devices</span>
              </div>
            </div>

            {/* Feature grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '5px 16px',
              fontSize: 10, fontFamily: 'monospace',
              color: colors.footerText,
              padding: '12px 0',
              borderTop: `1px solid ${colors.divider}`,
            }}>
              <span>✓ Real‑time attendance</span>
              <span>✓ Secure cloud sync</span>
              <span>✓ Biometric edge</span>
              <span>✓ SOC 2 Type II</span>
            </div>

            {/* Last sync */}
            <div style={{
              textAlign: 'right', marginTop: 10,
              fontSize: 9, fontFamily: 'monospace',
              letterSpacing: '0.05em',
              color: isDark ? '#383838' : '#ccc8c2',
            }}>
              Last sync: {currentTime} UTC
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 14, marginTop: 22,
          fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em',
          color: isDark ? '#383838' : '#c4c0ba',
        }}>
          <span>SOC 2 Type II</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>HIPAA Compliant</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>ISO 27001</span>
        </div>
      </div>
    </div>
  );
}