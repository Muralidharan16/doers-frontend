import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <div 
      className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Theme Toggle in top-right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] px-2 sm:px-0 z-10 animate-fade-in">
        {/* Logo block */}
        <div className="mb-8">
          <DoersLogo />
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
          {/* Header */}
          <div className="text-center mb-8 space-y-1.5">
            <h1 className="font-serif text-[22px] font-light leading-tight text-[var(--text-primary)]">Welcome back</h1>
            <p className="text-[13px] text-[var(--text-muted)] font-normal">
              Sign in to manage your studio operations.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                placeholder="coach@studio.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">Password</label>
                <a 
                  href="#" 
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--accent)', textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                  style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {!!error && (
              <div 
                className="p-3 rounded-[var(--radius-md)] text-[11px] text-center"
                style={{ 
                  backgroundColor: 'rgba(226,75,74,0.06)', 
                  border: '0.5px solid var(--red)',
                  color: 'var(--red)'
                }}
              >
                {getApiErrorMessage(error, 'Login failed. Please check your details.')}
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isPending}
              style={{ minHeight: '44px' }}
            >
              {isPending ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Social login divider */}
          <div className="my-6 flex items-center justify-between gap-3">
            <div className="flex-1 h-[0.5px]" style={{ backgroundColor: 'var(--border-default)' }} />
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-[0.5px]" style={{ backgroundColor: 'var(--border-default)' }} />
          </div>

          {/* Google Button */}
          <Button 
            type="button" 
            variant="secondary" 
            fullWidth 
            style={{ minHeight: '44px', gap: '10px' }}
            onClick={() => console.log('Social sign in')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google Account</span>
          </Button>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              New to Doers?{' '}
              <a 
                href="/signup" 
                className="font-medium underline underline-offset-4"
                style={{ color: 'var(--accent)' }}
              >
                Start your trial
              </a>
            </p>
          </div>
        </div>

        {/* Institutional Footer */}
        <div className="mt-6 flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--green)' }} />
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">All Systems Operational</span>
          </div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-mono">
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
}
