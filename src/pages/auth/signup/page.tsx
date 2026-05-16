import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '@/features/auth';
import { useTheme } from '@/shared/context/ThemeContext';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Sun, Moon, Eye, EyeOff, ChevronRight, ChevronLeft, Building2, User, Lock } from 'lucide-react';
import type { FacilityType } from '@/features/auth/types';
import { FACILITY_TYPE_LABELS } from '@/features/auth/types';

// ─── Zod Schemas per step ───────────────────────────────────────────────────

const step1Schema = z.object({
  org_name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  facility_type: z.enum([
    'gym', 'yoga_studio', 'crossfit_box', 'swimming_pool',
    'martial_arts', 'dance_studio', 'sports_academy', 'multi_sport', 'others',
  ], { message: 'Please select a facility type' }),
});

const step2Schema = z.object({
  owner_name: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  email: z.string().email('Please enter a valid email address'),
});

const step3Schema = z.object({
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[!@#$%^&*]/, 'Must include a special character (!@#$%^&*)'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ─── Password strength helper ────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*]/.test(pw)) score++;
  if (score <= 2) return { score, label: 'Weak', color: '#e05a4a' };
  if (score <= 3) return { score, label: 'Fair', color: '#d4943a' };
  if (score === 4) return { score, label: 'Good', color: '#6aab6a' };
  return { score, label: 'Strong', color: '#3a9a5a' };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignupPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Accumulated form data across steps
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});

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
    stepActive: isDark ? '#f0f0f0' : '#1a1a1a',
    stepDone: isDark ? '#3a3a3a' : '#d4d0ca',
    stepInactive: isDark ? '#2a2a2a' : '#ece8e2',
  };

  // ── Per-step forms ──
  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: formData });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: formData });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const selectedFacilityType = useWatch({ control: form1.control, name: 'facility_type' });
  const watchPassword = useWatch({ control: form3.control, name: 'password' }) || '';
  const strength = getPasswordStrength(watchPassword);

  const onStep1 = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2 = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const onStep3 = (data: Step3Data) => {
    const payload = {
      org_name: formData.org_name!,
      owner_name: formData.owner_name!,
      email: formData.email!,
      facility_type: formData.facility_type! as FacilityType,
      password: data.password,
    };
    signup(payload, {
      onSuccess: () => {
        navigate('/check-inbox', { state: { email: formData.email } });
      },
    });
  };

  const stepLabels = ['Organisation', 'Owner', 'Security'];
  const stepIcons = [Building2, User, Lock];

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '14px 18px',
    background: colors.inputBg,
    border: `1px solid ${hasError ? '#d97b6b' : colors.inputBorder}`,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    color: colors.inputText,
    outline: 'none',
    boxSizing: 'border-box' as const,
    letterSpacing: '0.01em',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    boxShadow: hasError ? '0 0 0 4px rgba(217,123,107,0.1)' : 'none',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: colors.labelText,
    marginBottom: 8,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#c0695a',
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const fieldWrap: React.CSSProperties = { marginBottom: 20 };

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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .signup-card {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          max-width: 520px;
        }
        .step-content {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
          background: radial-gradient(ellipse at center,
            transparent 40%,
            ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'} 100%
          );
        }
        .input-el:hover  { border-color: ${isDark ? '#3a3a3a' : '#ccc8c2'} !important; }
        .input-el:focus  { border-color: ${colors.inputFocus} !important; box-shadow: 0 0 0 4px ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} !important; }

        .select-el {
          width: 100%;
          padding: 14px 18px;
          background: ${colors.inputBg};
          border: 1px solid ${colors.inputBorder};
          border-radius: 12px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          color: ${colors.inputText};
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${isDark ? '%23666666' : '%238a8a8a'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 44px;
        }
        .select-el:hover { border-color: ${isDark ? '#3a3a3a' : '#ccc8c2'}; }
        .select-el:focus { border-color: ${colors.inputFocus}; box-shadow: 0 0 0 4px ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}; }
        .select-el option { background: ${colors.inputBg}; color: ${colors.inputText}; }

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
        .btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.985); box-shadow: none; }
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

        .btn-ghost {
          background: none; border: 1px solid ${colors.cardBorder}; color: ${colors.mutedText};
          border-radius: 50px; padding: 12px 20px; font-size: 12px;
          font-family: 'Inter', sans-serif; font-weight: 500; letter-spacing: 0.04em;
          text-transform: uppercase; cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { color: ${colors.headingText}; border-color: ${colors.inputFocus}; }

        .link-muted { font-size: 12px; color: ${colors.mutedText}; text-decoration: none; transition: color 0.2s; }
        .link-muted:hover { color: ${colors.headingText}; }
        .link-bold {
          color: ${colors.headingText}; font-weight: 600; text-decoration: none;
          border-bottom: 1px solid ${isDark ? '#3a3a3a' : '#d4d0ca'}; padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .link-bold:hover { border-color: ${colors.headingText}; }

        .spin { animation: spin 0.75s linear infinite; }

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

        .strength-bar {
          height: 3px; border-radius: 2px;
          transition: width 0.4s ease, background 0.4s ease;
        }
      `}</style>

      <div className="bg-texture" />
      <div className="bg-vignette" />

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Card */}
      <div className="signup-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 24,
          boxShadow: isDark
            ? '0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)'
            : '0 32px 64px -16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}>

          {/* ── Header ── */}
          <div style={{
            padding: '40px 40px 32px',
            textAlign: 'center',
            borderBottom: `1px solid ${colors.divider}`,
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              {!imgError ? (
                <img
                  src="/logo.png"
                  alt="Doers"
                  style={{
                    height: 110,
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
                  letterSpacing: '-0.02em',
                }}>
                  Doers
                </div>
              )}
            </div>

            <div style={{ width: 40, height: 1, background: isDark ? '#333' : '#ddd9d3', margin: '0 auto 16px' }} />

            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 13, fontWeight: 400, fontStyle: 'italic',
              color: colors.bodyText, margin: '0 0 24px',
              letterSpacing: '0.02em', lineHeight: 1.7,
            }}>
              Create your organisation account
            </p>

            {/* ── Step indicator ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const isActive = step === n;
                const isDone = step > n;
                const Icon = stepIcons[i];

                return (
                  <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Step circle */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        border: `1.5px solid ${isActive ? colors.stepActive : isDone ? colors.stepDone : colors.stepInactive}`,
                        background: isActive ? colors.stepActive : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}>
                        {isDone ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke={isDark ? '#3a3a3a' : '#d4d0ca'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <Icon
                            size={15}
                            color={isActive ? colors.btnText : isDark ? '#3a3a3a' : '#c4c0ba'}
                          />
                        )}
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: isActive ? colors.headingText : colors.mutedText,
                        transition: 'color 0.3s ease',
                      }}>
                        {label}
                      </span>
                    </div>

                    {/* Connector line (not after last) */}
                    {i < stepLabels.length - 1 && (
                      <div style={{
                        width: 64, height: 1.5, margin: '0 8px',
                        marginBottom: 22,
                        background: step > n
                          ? (isDark ? '#3a3a3a' : '#c4c0ba')
                          : colors.divider,
                        transition: 'background 0.3s ease',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Form body ── */}
          <div style={{ padding: '32px 40px 28px' }}>

            {/* API error */}
            {error ? (
              <div style={{
                fontSize: 12, lineHeight: 1.5, marginBottom: 20,
                color: isDark ? '#f08070' : '#b94a3a',
                background: isDark ? 'rgba(180,60,40,0.12)' : '#fdf2f0',
                border: `1px solid ${isDark ? 'rgba(180,60,40,0.3)' : '#f5cdc8'}`,
                borderRadius: 10, padding: '10px 14px',
              }}>
                {getApiErrorMessage(error, 'Something went wrong. Please try again.')}
              </div>
            ) : null}

            {/* ═══ STEP 1: Organisation ═══ */}
            {step === 1 && (
              <div className="step-content">
                <form onSubmit={form1.handleSubmit(onStep1)}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Organisation Name</label>
                    <input
                      type="text"
                      placeholder="Titan Fitness"
                      autoComplete="organization"
                      className="input-el"
                      style={inputStyle(!!form1.formState.errors.org_name)}
                      {...form1.register('org_name')}
                    />
                    {form1.formState.errors.org_name ? (
                      <p style={errorStyle}>⚠ {String(form1.formState.errors.org_name.message)}</p>
                    ) : null}
                  </div>

                  <div style={fieldWrap}>
                    <label style={labelStyle}>Facility Type</label>
                    <select
                      className="select-el"
                      style={{ color: selectedFacilityType ? colors.inputText : colors.inputPlaceholder }}
                      {...form1.register('facility_type')}
                    >
                      <option value="" disabled>Select facility type…</option>
                      {(Object.entries(FACILITY_TYPE_LABELS) as [FacilityType, string][]).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                    {form1.formState.errors.facility_type ? (
                      <p style={errorStyle}>⚠ {String(form1.formState.errors.facility_type.message)}</p>
                    ) : null}
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
                    Continue <ChevronRight size={15} />
                  </button>
                </form>
              </div>
            )}

            {/* ═══ STEP 2: Owner ═══ */}
            {step === 2 && (
              <div className="step-content">
                <form onSubmit={form2.handleSubmit(onStep2)}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Owner Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      className="input-el"
                      style={inputStyle(!!form2.formState.errors.owner_name)}
                      {...form2.register('owner_name')}
                    />
                    {form2.formState.errors.owner_name ? (
                      <p style={errorStyle}>⚠ {String(form2.formState.errors.owner_name.message)}</p>
                    ) : null}
                  </div>

                  <div style={fieldWrap}>
                    <label style={labelStyle}>Work Email</label>
                    <input
                      type="email"
                      placeholder="john@titanfitness.com"
                      autoComplete="email"
                      className="input-el"
                      style={inputStyle(!!form2.formState.errors.email)}
                      {...form2.register('email')}
                    />
                    {form2.formState.errors.email ? (
                      <p style={errorStyle}>⚠ {String(form2.formState.errors.email.message)}</p>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
                      <ChevronLeft size={14} /> Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ margin: 0 }}>
                      Continue <ChevronRight size={15} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ═══ STEP 3: Password ═══ */}
            {step === 3 && (
              <div className="step-content">
                <form onSubmit={form3.handleSubmit(onStep3)}>
                  {/* Password */}
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 8 chars, uppercase, number, symbol"
                        autoComplete="new-password"
                        className="input-el"
                        style={{ ...inputStyle(!!form3.formState.errors.password), paddingRight: 52 }}
                        {...form3.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide' : 'Show'}
                        style={{
                          position: 'absolute', right: 16, top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.mutedText, display: 'flex',
                          alignItems: 'center', padding: 0,
                        }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Password strength bar */}
                    {watchPassword.length > 0 ? (
                      <div style={{ marginTop: 10 }}>
                        <div style={{
                          display: 'flex', gap: 4, marginBottom: 5,
                        }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{
                              flex: 1, height: 3, borderRadius: 2,
                              background: i <= strength.score ? strength.color : colors.divider,
                              transition: 'background 0.3s ease',
                            }} />
                          ))}
                        </div>
                        <p style={{
                          fontSize: 11, margin: 0,
                          color: strength.color,
                          fontWeight: 500, letterSpacing: '0.04em',
                        }}>
                          {strength.label} password
                        </p>
                      </div>
                    ) : null}

                    {form3.formState.errors.password ? (
                      <p style={errorStyle}>⚠ {String(form3.formState.errors.password.message)}</p>
                    ) : null}
                  </div>

                  {/* Confirm password */}
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="confirm_password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className="input-el"
                        style={{ ...inputStyle(!!form3.formState.errors.confirm_password), paddingRight: 52 }}
                        {...form3.register('confirm_password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label={showConfirm ? 'Hide' : 'Show'}
                        style={{
                          position: 'absolute', right: 16, top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.mutedText, display: 'flex',
                          alignItems: 'center', padding: 0,
                        }}
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {form3.formState.errors.confirm_password ? (
                      <p style={errorStyle}>⚠ {String(form3.formState.errors.confirm_password.message)}</p>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button type="button" className="btn-ghost" onClick={() => setStep(2)}>
                      <ChevronLeft size={14} /> Back
                    </button>
                    <button type="submit" disabled={isPending} className="btn-primary" style={{ margin: 0 }}>
                      {isPending ? (
                        <>
                          <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                          </svg>
                          Creating…
                        </>
                      ) : (
                        <>Create Account <ChevronRight size={15} /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Already have account */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: colors.divider }} />
              <span style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em', color: isDark ? '#333' : '#ccc8c2' }}>or</span>
              <div style={{ flex: 1, height: 1, background: colors.divider }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: colors.mutedText, margin: 0, fontWeight: 300 }}>
              Already have an account?{' '}
              <a href="/login" className="link-bold">Sign in</a>
            </p>
          </div>

          {/* ── Footer ── */}
          <div style={{
            background: colors.footerBg,
            borderTop: `1px solid ${colors.divider}`,
            padding: '16px 40px 20px',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '5px 16px', fontSize: 10, fontFamily: 'monospace',
              color: colors.footerText,
            }}>
              <span>🔒 AES-256 Encryption</span>
              <span>✓ SOC 2 Type II</span>
              <span>✓ HIPAA Compliant</span>
              <span>✓ ISO 27001</span>
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
          <span>No credit card required</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Free 14-day trial</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}
