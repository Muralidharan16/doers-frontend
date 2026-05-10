import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth';
import { useTheme } from '@/shared/context/ThemeContext';
import { Moon, Sun, Dumbbell } from 'lucide-react';

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

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gym-black px-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gym-lime/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gym-lime/5 rounded-full blur-[120px]" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl bg-gym-dark/50 border border-gym-slate text-white hover:bg-gym-slate transition-all z-10"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-gym-lime" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gym-lime rounded-2xl mb-4 shadow-[0_0_30px_rgba(212,255,0,0.3)]">
            <Dumbbell className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            DOERS <span className="text-gym-lime text-xl align-top">GYM</span>
          </h1>
          <p className="text-gym-slate/80 text-gray-400">Precision Performance Management</p>
        </div>

        <div className="bg-gym-dark/40 backdrop-blur-xl border border-gym-slate p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Work Email</label>
              <input
                type="email"
                placeholder="michael@doersgym.com"
                className="w-full bg-gym-black/50 border border-gym-slate rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gym-lime focus:ring-1 focus:ring-gym-lime transition-all"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gym-black/50 border border-gym-slate rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gym-lime focus:ring-1 focus:ring-gym-lime transition-all"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-400 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/30 p-4 rounded-xl">
                {error.message || 'Authentication failed. Please check your credentials.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gym-lime hover:bg-gym-lime/90 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.2)] hover:shadow-[0_0_30px_rgba(212,255,0,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-gym-lime transition-colors">
              Request access or recover password
            </a>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-600 text-xs tracking-widest uppercase font-bold">
          Powered by Doers Engine v2.0
        </p>
      </div>
    </div>
  );
}