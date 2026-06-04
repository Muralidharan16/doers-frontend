import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check, ArrowRight, LoaderCircle, Globe } from 'lucide-react';
import { onboardingApi } from '@/features/onboarding';
import { useAuthStore } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DoersLogo } from '@/components/ui/DoersLogo';

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
  const [successStep, setSuccessStep] = useState(false);

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

  const [lookupState, setLookupState] = useState<'idle' | 'found' | 'manual'>('idle');
  const [lookupMessage, setLookupMessage] = useState('Verification required for automated registry.');

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
  const defaultLookupMessage = 'Verification required for automated registry.';
  const effectiveLookupState = isPincodeReady ? lookupState : 'idle';
  const effectiveLookupMessage = isPincodeReady ? lookupMessage : defaultLookupMessage;

  const pincodeLookup = useMutation({
    mutationFn: onboardingApi.lookupPincode,
    onSuccess: (data) => {
      setValue('city', data.city, { shouldValidate: true, shouldDirty: true });
      setValue('state', data.state, { shouldValidate: true, shouldDirty: true });
      setLookupState('found');
      setLookupMessage(data.district ? `${data.district} localized.` : 'Registry localized.');
    },
    onError: () => {
      setLookupState('manual');
      setLookupMessage('Local registry unavailable. Manual entry enabled.');
    },
  });
  const lookupPincode = pincodeLookup.mutate;
  const resetPincodeLookup = pincodeLookup.reset;

  const completeMutation = useMutation({
    mutationFn: onboardingApi.complete,
    onSuccess: () => {
      setSuccessStep(true);
      setTimeout(() => {
        completeOnboarding();
        navigate('/dashboard', { replace: true });
      }, 2000);
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
        setSuccessStep(true);
        setTimeout(() => {
          completeOnboarding();
          navigate('/dashboard', { replace: true });
        }, 2000);
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

  const onSubmit = (data: OnboardingFormData) => {
    completeMutation.mutate({
      phone: data.phone,
      country_code: 'IN',
      address_line1: data.address_line1,
      address_line2: data.address_line2 || undefined,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    });
  };

  return (
    <div 
      className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Theme Toggle in top-right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[480px] px-2 sm:px-0 z-10 animate-fade-in">
        <div className="mb-6">
          <DoersLogo />
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1 mb-8">
          <div 
            className="flex-1 h-[3px] rounded-[2px]" 
            style={{ backgroundColor: 'var(--accent)' }}
          />
          <div 
            className="flex-1 h-[3px] rounded-[2px] transition-all duration-300" 
            style={{ 
              backgroundColor: successStep ? 'var(--accent)' : 'var(--accent)',
              opacity: successStep ? 1 : 0.4
            }}
          />
        </div>

        {/* Card */}
        <div 
          className="w-full transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '0.5px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
          }}
        >
          {successStep ? (
            /* Success State */
            <div className="flex flex-col items-center text-center py-6 space-y-6 animate-fade-in">
              <div 
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  backgroundColor: 'var(--accent-subtle)', 
                  border: '0.5px solid var(--accent)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="space-y-2">
                <h1 className="font-serif text-[22px] font-light text-[var(--text-primary)]">All set!</h1>
                <p className="text-[13px] text-[var(--text-muted)] max-w-xs mx-auto">
                  Your registry parameters have been initialized. Directing to Studio Intelligence...
                </p>
              </div>
            </div>
          ) : (
            /* Form Step */
            <div className="space-y-6">
              <div className="space-y-1.5 text-center">
                <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  STEP 1 OF 2
                </div>
                <h2 className="font-serif italic text-[20px] font-light text-[var(--text-primary)]">Institutional Parameters</h2>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Establish your geographical registry details.
                </p>
              </div>

              {completeMutation.error && (
                <div 
                  className="p-3 rounded-[var(--radius-md)] text-[10px] font-mono text-center uppercase tracking-wider"
                  style={{ 
                    backgroundColor: 'rgba(226,75,74,0.06)', 
                    border: '0.5px solid var(--red)',
                    color: 'var(--red)'
                  }}
                >
                  <AlertCircle size={12} className="inline mr-2" />
                  {getApiErrorMessage(completeMutation.error, 'An unexpected error occurred during registry.')}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Registry Phone Line"
                  placeholder="+91 9876543210"
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <div className="relative">
                  <Input
                    label="Postal ID / Pincode"
                    maxLength={6}
                    placeholder="6 Digits"
                    error={errors.pincode?.message}
                    {...register('pincode')}
                  />
                  <div className="absolute right-4 top-[38px] opacity-35">
                    {pincodeLookup.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <Globe size={14} />}
                  </div>
                </div>

                <Input
                  label="Principal Registry Address"
                  placeholder="Street, Suite, or Geographical Landmark"
                  error={errors.address_line1?.message}
                  {...register('address_line1')}
                />

                <Input
                  label="Secondary Address Line (Optional)"
                  placeholder="Apartment, building details"
                  error={errors.address_line2?.message}
                  {...register('address_line2')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Jurisdiction / City"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    label="Region / Province"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                </div>

                {/* Lookup status indicator */}
                <div className="flex items-center gap-2 pt-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: effectiveLookupState === 'found' ? 'var(--accent)' : 'var(--text-muted)' }} 
                  />
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: effectiveLookupState === 'found' ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {effectiveLookupMessage}
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                    style={{ minHeight: '44px' }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={completeMutation.isPending}
                    style={{ flex: 1, minHeight: '44px' }}
                  >
                    {completeMutation.isPending ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <>
                        <span>Initialize Studio</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
