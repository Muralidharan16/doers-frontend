import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronRight, LoaderCircle, MapPin, Moon, Sun } from 'lucide-react';
import { onboardingApi } from '@/features/onboarding';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/shared/context/ThemeContext';
import { getApiErrorMessage } from '@/shared/lib/apiError';

const onboardingSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number'),
  address_line1: z.string().min(3, 'Address is required').max(160, 'Keep it under 160 characters'),
  address_line2: z.string().max(160, 'Keep it under 160 characters').optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a 6 digit pincode'),
  city: z.string().min(2, 'City is required').max(80, 'Keep it under 80 characters'),
  state: z.string().min(2, 'State is required').max(80, 'Keep it under 80 characters'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);

  const { data: statusData } = useQuery({
    queryKey: ['onboarding-status'],
    queryFn: () => onboardingApi.getStatus(),
  });

  useEffect(() => {
    if (onboardingCompleted || statusData?.onboarding_completed) {
      if (statusData?.onboarding_completed && !onboardingCompleted) {
        completeOnboarding();
        navigate('/dashboard', { replace: true });
      } else if (onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [onboardingCompleted, statusData, navigate, completeOnboarding]);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [imgError, setImgError] = useState(false);
  const [lookupState, setLookupState] = useState<'idle' | 'found' | 'manual'>('idle');
  const [lookupMessage, setLookupMessage] = useState('Enter 6 digits to auto-fill city and state.');

  const colors = useMemo(() => ({
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
  }), [isDark]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phone: '',
      address_line1: '',
      address_line2: '',
      pincode: '',
      city: '',
      state: '',
    },
  });

  const pincode = useWatch({ control, name: 'pincode' }) || '';
  const isPincodeReady = /^\d{6}$/.test(pincode);
  const defaultLookupMessage = 'Enter 6 digits to auto-fill city and state.';
  const effectiveLookupState = isPincodeReady ? lookupState : 'idle';
  const effectiveLookupMessage = isPincodeReady ? lookupMessage : defaultLookupMessage;

  const pincodeLookup = useMutation({
    mutationFn: onboardingApi.lookupPincode,
    onSuccess: (data) => {
      setValue('city', data.city, { shouldValidate: true, shouldDirty: true });
      setValue('state', data.state, { shouldValidate: true, shouldDirty: true });
      setLookupState('found');
      setLookupMessage(data.district ? `${data.district} district verified.` : 'Location verified.');
    },
    onError: () => {
      setLookupState('manual');
      setLookupMessage('Auto-fill unavailable. You can enter city and state manually.');
    },
  });
  const lookupPincode = pincodeLookup.mutate;
  const resetPincodeLookup = pincodeLookup.reset;

  const completeMutation = useMutation({
    mutationFn: onboardingApi.complete,
    onSuccess: () => {
      completeOnboarding();
      navigate('/dashboard', { replace: true });
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
        // Onboarding already completed, redirect to dashboard
        completeOnboarding();
        navigate('/dashboard', { replace: true });
      }
    },
  });

  useEffect(() => {
    if (!isPincodeReady) {
      resetPincodeLookup();
      return;
    }

    const timer = window.setTimeout(() => {
      setLookupState('idle');
      setLookupMessage(defaultLookupMessage);
      lookupPincode(pincode);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isPincodeReady, lookupPincode, pincode, resetPincodeLookup]);

  const inputStyle = (hasError?: boolean): CSSProperties => ({
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
    boxSizing: 'border-box',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    boxShadow: hasError ? '0 0 0 4px rgba(217,123,107,0.1)' : 'none',
  });

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: colors.labelText,
    marginBottom: 8,
  };

  const errorStyle: CSSProperties = {
    fontSize: 11,
    color: '#c0695a',
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const fieldWrap: CSSProperties = { marginBottom: 20 };

  const onSubmit = (data: OnboardingFormData) => {
    completeMutation.mutate({
      phone: data.phone,
      address_line1: data.address_line1,
      address_line2: data.address_line2 || undefined,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    });
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
        .onboarding-card {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          max-width: 640px;
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
        .input-el:hover { border-color: ${isDark ? '#3a3a3a' : '#ccc8c2'} !important; }
        .input-el:focus { border-color: ${colors.inputFocus} !important; box-shadow: 0 0 0 4px ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} !important; }
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
        .spin { animation: spin 0.75s linear infinite; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; gap: 0; }
          .onboarding-body { padding: 28px 24px 24px !important; }
          .onboarding-header { padding: 36px 24px 28px !important; }
        }
      `}</style>

      <div className="bg-texture" />
      <div className="bg-vignette" />

      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <div className="onboarding-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 24,
          boxShadow: isDark
            ? '0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)'
            : '0 32px 64px -16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}>
          <div className="onboarding-header" style={{
            padding: '40px 40px 30px',
            textAlign: 'center',
            borderBottom: `1px solid ${colors.divider}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              {!imgError ? (
                <img
                  src="/logo.png"
                  alt="Doers"
                  style={{
                    height: 104,
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

            <div style={{ width: 40, height: 1, background: isDark ? '#333' : '#ddd9d3', margin: '0 auto 16px' }} />
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 13,
              fontWeight: 400,
              fontStyle: 'italic',
              color: colors.bodyText,
              margin: 0,
              lineHeight: 1.7,
            }}>
              Complete your facility profile
            </p>
          </div>

          <div className="onboarding-body" style={{ padding: '32px 40px 28px' }}>
            {completeMutation.error ? (
              <div style={{
                fontSize: 12,
                lineHeight: 1.5,
                marginBottom: 20,
                color: isDark ? '#f08070' : '#b94a3a',
                background: isDark ? 'rgba(180,60,40,0.12)' : '#fdf2f0',
                border: `1px solid ${isDark ? 'rgba(180,60,40,0.3)' : '#f5cdc8'}`,
                borderRadius: 10,
                padding: '10px 14px',
              }}>
                {getApiErrorMessage(completeMutation.error, 'Could not complete onboarding. Please try again.')}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid">
                <div style={fieldWrap}>
                  <label htmlFor="phone" style={labelStyle}>Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+919876543210"
                    autoComplete="tel"
                    className="input-el"
                    style={inputStyle(!!errors.phone)}
                    {...register('phone')}
                  />
                  {errors.phone ? <p style={errorStyle}><AlertCircle size={12} /> {String(errors.phone.message)}</p> : null}
                </div>

                <div style={fieldWrap}>
                  <label htmlFor="pincode" style={labelStyle}>Pincode</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="560102"
                      autoComplete="postal-code"
                      className="input-el"
                      style={{ ...inputStyle(!!errors.pincode), paddingRight: 48 }}
                      {...register('pincode')}
                    />
                    <div style={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: effectiveLookupState === 'found' ? '#3a9a5a' : colors.mutedText,
                      display: 'flex',
                    }}>
                      {pincodeLookup.isPending ? <LoaderCircle className="spin" size={15} /> : <MapPin size={15} />}
                    </div>
                  </div>
                  {errors.pincode ? <p style={errorStyle}><AlertCircle size={12} /> {String(errors.pincode.message)}</p> : null}
                </div>
              </div>

              <div style={fieldWrap}>
                <label htmlFor="address_line1" style={labelStyle}>Address Line 1</label>
                <input
                  id="address_line1"
                  type="text"
                  placeholder="123 Fitness Street"
                  autoComplete="address-line1"
                  className="input-el"
                  style={inputStyle(!!errors.address_line1)}
                  {...register('address_line1')}
                />
                {errors.address_line1 ? <p style={errorStyle}><AlertCircle size={12} /> {String(errors.address_line1.message)}</p> : null}
              </div>

              <div style={fieldWrap}>
                <label htmlFor="address_line2" style={labelStyle}>Address Line 2</label>
                <input
                  id="address_line2"
                  type="text"
                  placeholder="HSR Layout"
                  autoComplete="address-line2"
                  className="input-el"
                  style={inputStyle(!!errors.address_line2)}
                  {...register('address_line2')}
                />
                {errors.address_line2 ? <p style={errorStyle}><AlertCircle size={12} /> {String(errors.address_line2.message)}</p> : null}
              </div>

              <div className="form-grid">
                <div style={fieldWrap}>
                  <label htmlFor="city" style={labelStyle}>City</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Bengaluru"
                    autoComplete="address-level2"
                    className="input-el"
                    style={inputStyle(!!errors.city)}
                    {...register('city')}
                  />
                  {errors.city ? <p style={errorStyle}><AlertCircle size={12} /> {String(errors.city.message)}</p> : null}
                </div>

                <div style={fieldWrap}>
                  <label htmlFor="state" style={labelStyle}>State</label>
                  <input
                    id="state"
                    type="text"
                    placeholder="KARNATAKA"
                    autoComplete="address-level1"
                    className="input-el"
                    style={inputStyle(!!errors.state)}
                    {...register('state')}
                  />
                  {errors.state ? <p style={errorStyle}><AlertCircle size={12} /> {String(errors.state.message)}</p> : null}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: effectiveLookupState === 'found' ? '#3a9a5a' : effectiveLookupState === 'manual' ? '#c0695a' : colors.mutedText,
                fontSize: 12,
                margin: '-4px 0 20px',
              }}>
                {effectiveLookupState === 'found' ? <CheckCircle2 size={14} /> : <MapPin size={14} />}
                <span>{effectiveLookupMessage}</span>
              </div>

              <button type="submit" disabled={completeMutation.isPending} className="btn-primary">
                {completeMutation.isPending ? (
                  <>
                    <LoaderCircle className="spin" size={14} />
                    Saving Profile
                  </>
                ) : (
                  <>
                    Complete Onboarding
                    <ChevronRight size={15} />
                  </>
                )}
              </button>
            </form>
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
              <span>Location verified</span>
              <span>Trial activated</span>
              <span>Secure cloud sync</span>
              <span>Dashboard ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
