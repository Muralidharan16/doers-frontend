import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth';
import { useTheme } from '@/shared/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const { theme, toggleTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 relative">
      {/* Theme toggle – classic style */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-9 h-9 rounded-full border border-rule bg-paper flex items-center justify-center text-ink-60 hover:text-ink transition-colors"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Card */}
      <div className="w-full max-w-md animate-rise">
        <div className="bg-paper border border-rule rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-rule">
            <h1 className="font-serif text-4xl font-semibold tracking-wide text-ink">Doers</h1>
            <p className="font-mono text-[11px] tracking-[0.18em] text-ink-60 uppercase mt-2">Studio Management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] text-ink-60 uppercase mb-1">Email</label>
              <input
                type="email"
                placeholder="michael@doersgym.com"
                className="w-full px-3 py-2 bg-transparent border border-rule rounded focus:outline-none focus:border-ink transition-colors font-sans text-sm"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 font-mono">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.12em] text-ink-60 uppercase mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full px-3 py-2 bg-transparent border border-rule rounded focus:outline-none focus:border-ink transition-colors font-sans text-sm"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1 font-mono">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50/50 p-3 rounded border border-red-200 font-mono">
                {error.message || 'Login failed. Check credentials.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-ink text-paper py-2.5 rounded font-medium hover:bg-ink/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm tracking-wide"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center border-t border-rule pt-5">
            <a href="#" className="font-mono text-[10px] tracking-[0.12em] text-ink-60 hover:text-ink transition">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Fine print */}
        <div className="text-center mt-6 font-mono text-[9px] tracking-[0.1em] text-ink-30">
          SECURE ACCESS · DOERS GYM SAAS
        </div>
      </div>
    </div>
  );
}