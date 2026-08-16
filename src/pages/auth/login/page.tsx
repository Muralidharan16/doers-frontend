import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useLogin } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DoersLogo } from '@/components/ui/DoersLogo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <div className="w-full max-w-[420px] px-2 sm:px-0 z-10 animate-fade-in">
        <div className="mb-8"><DoersLogo /></div>

        <div className="w-full transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
          <div className="text-center mb-8 space-y-1.5">
            <h1 className="font-serif text-[22px] font-light leading-tight text-[var(--text-primary)]">Welcome back</h1>
            <p className="text-[13px] text-[var(--text-muted)] font-normal">Sign in to manage your studio operations.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Input label="Email Address" type="email" autoComplete="email" placeholder="coach@studio.com" error={errors.email?.message} {...register('email')} />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">Password</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1" style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {!!error && (
              <div className="p-3 rounded-[var(--radius-md)] text-[11px] text-center" role="alert" style={{ backgroundColor: 'rgba(226,75,74,0.06)', border: '0.5px solid var(--red)', color: 'var(--red)' }}>
                {getApiErrorMessage(error, 'Login failed. Please check your details.')}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={isPending} style={{ minHeight: '44px' }}>
              {isPending ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              New to Doers?{' '}
              <Link to="/signup" className="font-medium underline underline-offset-4" style={{ color: 'var(--accent)' }}>
                Start your trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
