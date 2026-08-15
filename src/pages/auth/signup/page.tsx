import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '@/features/auth';
import type { SignupPayload } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Eye, EyeOff } from 'lucide-react';
import { FACILITY_TYPE_LABELS } from '@/features/auth/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DoersLogo } from '@/components/ui/DoersLogo';

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
  password: z.string().min(8, 'Minimum 8 characters').regex(/[A-Z]/, 'Must include uppercase').regex(/[0-9]/, 'Must include a number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords mismatch',
  path: ['confirm_password'],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: formData });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: formData });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const onStep1 = (data: Step1Data) => {
    setFormData((previous) => ({ ...previous, ...data }));
    setStep(2);
  };
  const onStep2 = (data: Step2Data) => {
    setFormData((previous) => ({ ...previous, ...data }));
    setStep(3);
  };
  const onStep3 = (data: Step3Data) => {
    const payload = { ...formData, ...data };
    if (!payload.org_name || !payload.owner_name || !payload.email || !payload.password || !payload.facility_type) return;

    signup(payload as SignupPayload, {
      onSuccess: () => {
        if (formData.email) sessionStorage.setItem('signup-email', formData.email);
        navigate('/check-inbox', { state: { email: formData.email } });
      },
    });
  };

  const stepLabels = ['Registry', 'Identity', 'Security'];

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="w-full max-w-[420px] px-2 sm:px-0 z-10 animate-fade-in">
        <div className="mb-8"><DoersLogo /></div>
        <div className="w-full transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
          <div className="text-center mb-6 space-y-2">
            <h1 className="font-serif text-[22px] font-light leading-tight text-[var(--text-primary)]">Open Your Studio</h1>
            <p className="text-[13px] text-[var(--text-muted)] font-normal">Step {step} of 3: {stepLabels[step - 1]} Setup</p>
            <div className="flex gap-1.5 pt-2">
              {[1, 2, 3].map((currentStep) => (
                <div key={currentStep} className="flex-1 h-[3px] rounded-[2px] transition-all duration-300" style={{ backgroundColor: currentStep <= step ? 'var(--accent)' : 'var(--border-default)', opacity: currentStep <= step ? 1 : 0.4 }} />
              ))}
            </div>
          </div>

          <div>
            {!!error && (
              <div className="mb-6 p-3 rounded-[var(--radius-md)] text-[11px] text-center" role="alert" style={{ backgroundColor: 'rgba(226,75,74,0.06)', border: '0.5px solid var(--red)', color: 'var(--red)' }}>
                {getApiErrorMessage(error, 'Signup failed. Please try again.')}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-5 animate-fade-in">
                <Input label="Studio or Gym Name" placeholder="Titan Fitness" error={form1.formState.errors.org_name?.message} {...form1.register('org_name')} />
                <div className="space-y-2 flex flex-col">
                  <label className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">What kind of facility?</label>
                  <select style={{ backgroundColor: 'var(--bg-input)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px', width: '100%' }} className="focus:border-[var(--border-focus)] appearance-none" {...form1.register('facility_type')}>
                    <option value="" disabled>Select type...</option>
                    {Object.entries(FACILITY_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  {form1.formState.errors.facility_type && <p className="text-[10px] font-mono text-[var(--red)] uppercase tracking-wider">⚠ {form1.formState.errors.facility_type.message}</p>}
                </div>
                <Button type="submit" variant="primary" fullWidth style={{ minHeight: '44px', marginTop: '1.5rem' }}>Next Step</Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-5 animate-fade-in">
                <Input label="Owner Full Name" placeholder="Alex Rivers" error={form2.formState.errors.owner_name?.message} {...form2.register('owner_name')} />
                <Input label="Work Email" type="email" autoComplete="email" placeholder="alex@studio.com" error={form2.formState.errors.email?.message} {...form2.register('email')} />
                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)} style={{ flex: 1, minHeight: '44px' }}>Back</Button>
                  <Button type="submit" variant="primary" style={{ flex: 2, minHeight: '44px' }}>Continue</Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-5 animate-fade-in">
                <Input label="Secure Password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" error={form3.formState.errors.password?.message} {...form3.register('password')} rightElement={<button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 flex items-center justify-center">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
                <Input label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••" error={form3.formState.errors.confirm_password?.message} {...form3.register('confirm_password')} rightElement={<button type="button" aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'} onClick={() => setShowConfirmPassword((value) => !value)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 flex items-center justify-center">{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)} style={{ flex: 1, minHeight: '44px' }}>Back</Button>
                  <Button type="submit" variant="primary" disabled={isPending} style={{ flex: 2, minHeight: '44px' }}>{isPending ? 'Saving...' : 'Finish Setup'}</Button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--border-default)] text-center">
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-medium underline underline-offset-4" style={{ color: 'var(--accent)' }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
