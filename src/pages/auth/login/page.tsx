import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth';
import { useTheme } from '@/shared/context/ThemeContext';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/logo.png';

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
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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

  return (
    <div className="min-h-screen bg-[#f8f6f2] dark:bg-[#121212] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0% { opacity: 0.3; transform: scale(0.98); }
          100% { opacity: 0.7; transform: scale(1.02); }
        }
        @keyframes syncPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-sync-pulse {
          animation: syncPulse 1.6s ease-in-out infinite;
        }
        .animate-sync-pulse-delay-1 {
          animation: syncPulse 1.6s ease-in-out infinite 0.2s;
        }
        .animate-sync-pulse-delay-2 {
          animation: syncPulse 1.6s ease-in-out infinite 0.4s;
        }
        .bg-radial-soft {
          background: radial-gradient(ellipse at 50% 30%, rgba(255,255,240,0.5) 0%, rgba(248,246,242,0) 70%);
        }
        .dark .bg-radial-soft {
          background: radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.03) 0%, rgba(18,18,18,0) 70%);
        }
      `}</style>

      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-radial-soft"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.02)_100%)]"></div>
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[600px] bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,0,0,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.02)_0%,transparent_70%)] rounded-full animate-[breathe_6s_ease-in-out_infinite_alternate]"></div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-20 w-9 h-9 rounded-full border border-[#ece8e2] dark:border-[#2a2a2a] bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#5b5b5b] dark:text-[#9a9a9a] hover:text-[#1a1a1a] dark:hover:text-white transition-all duration-200 hover:shadow-sm"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Main card */}
      <div className="w-full max-w-[500px] animate-[fadeUp_0.65s_cubic-bezier(0.15,0.9,0.25,1)]">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-[#ece8e2] dark:border-[#2a2a2a] shadow-[0_25px_40px_-12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.01)] dark:shadow-[0_25px_40px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.12)] transition-all duration-300">

          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center border-b border-[#ece8e2] dark:border-[#2a2a2a]">
            <div className="flex justify-center mb-5">
              {!imgError ? (
                <img
                  src={logo}
                  alt="Doers"
                  className="h-12 w-auto object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="text-3xl font-serif font-semibold text-[#1a1a1a] dark:text-white">Doers</div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#7a7a7a] dark:text-[#6b6b6b] uppercase">
                Fitness Operations
              </span>
              <span className="w-1 h-1 rounded-full bg-[#d4d0c8] dark:bg-[#3a3a3a]"></span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#7a7a7a] dark:text-[#6b6b6b] uppercase">
                Biometric Core
              </span>
            </div>
            <p className="text-sm text-[#5e5e5e] dark:text-[#9a9a9a] mt-5 leading-relaxed">
              Secure access for studios & athletic facilities
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-6 pb-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.04em] text-[#4b4b4b] dark:text-[#8a8a8a] mb-1.5 ml-1">Work email</label>
              <input
                type="email"
                placeholder="alex@doers.studio"
                className="w-full px-4 py-3.5 bg-white dark:bg-[#0f0f0f] border border-[#ece8e2] dark:border-[#2a2a2a] rounded-2xl focus:outline-none focus:border-[#b8b2a8] dark:focus:border-[#4a4a4a] focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all duration-200 hover:border-[#cbc3b8] dark:hover:border-[#3a3a3a] text-[#1a1a1a] dark:text-white"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.04em] text-[#4b4b4b] dark:text-[#8a8a8a] mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="··········"
                  className="w-full px-4 py-3.5 bg-white dark:bg-[#0f0f0f] border border-[#ece8e2] dark:border-[#2a2a2a] rounded-2xl focus:outline-none focus:border-[#b8b2a8] dark:focus:border-[#4a4a4a] focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all duration-200 hover:border-[#cbc3b8] dark:hover:border-[#3a3a3a] pr-12 text-[#1a1a1a] dark:text-white"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a9a9a] dark:text-[#6b6b6b] hover:text-[#1a1a1a] dark:hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                {error.message || 'Authentication failed.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#191919] dark:bg-[#2a2a2a] hover:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a] text-white font-medium py-3.5 px-4 rounded-full transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? 'Signing in...' : 'Sign in to Console'}
            </button>

            <div className="text-center">
              <a href="#" className="text-xs text-[#8a8a8a] dark:text-[#7a7a7a] hover:text-[#1a1a1a] dark:hover:text-white transition-colors">Forgot password?</a>
            </div>
          </form>

          {/* Footer - FIXED LAYOUT */}
          <div className="bg-[#fefdfb] dark:bg-[#141414] border-t border-[#ece8e2] dark:border-[#2a2a2a] rounded-b-3xl px-8 py-6">
            {/* Row 1: Systems Online + biometric count */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
                </span>
                <span className="text-[11px] font-mono tracking-[0.04em] text-[#5a5a5a] dark:text-[#8a8a8a]">Systems Online</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-1 h-1 rounded-full bg-[#1a1a1a] dark:bg-white animate-sync-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-[#1a1a1a] dark:bg-white animate-sync-pulse-delay-1"></div>
                  <div className="w-1 h-1 rounded-full bg-[#1a1a1a] dark:bg-white animate-sync-pulse-delay-2"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#7a7a7a] dark:text-[#6b6b6b]">
                <span>🔒 AES‑256</span>
                <span className="w-px h-3 bg-[#e0e0e0] dark:bg-[#3a3a3a]"></span>
                <span className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
                  </svg>
                  3 biometric devices
                </span>
              </div>
            </div>

            {/* Row 2: Feature grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono text-[#898989] dark:text-[#6b6b6b] py-3 border-t border-[#ece8e2] dark:border-[#2a2a2a]">
              <span className="flex items-center gap-1.5">✓ Real‑time attendance</span>
              <span className="flex items-center gap-1.5">✓ Secure cloud sync</span>
              <span className="flex items-center gap-1.5">✓ Biometric edge</span>
              <span className="flex items-center gap-1.5">✓ SOC 2 Type II</span>
            </div>

            {/* Row 3: Last sync */}
            <div className="text-right mt-3 text-[9px] font-mono tracking-wide text-[#b0aba0] dark:text-[#5a5a5a]">
              Last sync: {currentTime} UTC
            </div>
          </div>
        </div>

        {/* Extra trust badges */}
        <div className="text-center mt-5 text-[10px] font-mono tracking-wide text-[#8b8b8b] dark:text-[#6b6b6b] flex justify-center gap-5">
          <span className="opacity-70">SOC 2 Type II</span>
          <span className="opacity-70">HIPAA Compliant</span>
        </div>
      </div>
    </div>
  );
}