import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoaderCircle, Mail } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { authApi } from '@/features/auth/services/authApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DoersLogo } from '@/components/ui/DoersLogo';

interface CheckInboxLocationState {
  email?: string;
}

export default function CheckInboxPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const email = useMemo(() => {
    const stateEmail = (location.state as CheckInboxLocationState | null)?.email;
    const queryEmail = new URLSearchParams(location.search).get('email');
    return stateEmail || queryEmail || sessionStorage.getItem('signup-email') || '';
  }, [location.search, location.state]);

  const [isPollingExpired, setIsPollingExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPollingExpired(true);
    }, 10 * 60 * 1000); // 10 minutes
    return () => clearTimeout(timer);
  }, []);

  const resendMutation = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      // Reset the polling timer when resending email
      setIsPollingExpired(false);
    }
  });

  const signupStatusQuery = useQuery({
    queryKey: ['signup-status', email],
    queryFn: () => authApi.signupStatus(email),
    enabled: Boolean(email),
    refetchInterval: (query) => {
      if (isPollingExpired) return false;
      return query.state.data?.status === 'verified' ? false : 2500;
    },
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (email) sessionStorage.setItem('signup-email', email);
  }, [email]);

  useEffect(() => {
    if (signupStatusQuery.data?.status !== 'verified') return;

    const isCompleted = Boolean(signupStatusQuery.data.onboarding_completed);
    const { user, access_token, refresh_token } = signupStatusQuery.data;
    
    if (user && access_token && refresh_token) {
      setAuth(
        user,
        { access_token, refresh_token },
        isCompleted
      );
    }
    
    navigate(isCompleted ? '/dashboard' : '/onboarding', { replace: true });
  }, [navigate, signupStatusQuery.data, setAuth]);

  const canResend = Boolean(email) && !resendMutation.isPending;

  return (
    <div 
      className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] px-2 sm:px-0 z-10 animate-fade-in">
        <div className="mb-8">
          <DoersLogo />
        </div>

        <div 
          className="w-full transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '0.5px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
          }}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div 
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--accent-subtle)',
                border: '0.5px solid var(--accent)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Mail style={{ color: 'var(--accent)', width: '18px', height: '18px' }} />
            </div>

            <div className="space-y-2">
              <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--text-primary)', margin: 0 }}>Check your inbox</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                We sent a verification link to<br />
                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{email || 'your email'}</span>
              </p>
            </div>

            <div 
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-page)',
                border: '0.5px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {!isPollingExpired ? (
                <>
                  <LoaderCircle size={14} style={{ color: 'var(--accent)' }} className="animate-spin" />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Listening for verification...</span>
                </>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verification link expired.</span>
              )}
            </div>

            <div className="w-full space-y-4 pt-2">
              <Button 
                type="button"
                variant="secondary"
                fullWidth
                disabled={!canResend}
                onClick={() => resendMutation.mutate(email)}
                style={{ 
                  border: '0.5px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent',
                  minHeight: '44px'
                }}
              >
                {resendMutation.isPending ? 'Sending...' : 'Resend Email'}
              </Button>
              
              {resendMutation.isSuccess && (
                <p style={{ fontSize: '12px', color: 'var(--green)', margin: 0 }}>Verification email resent.</p>
              )}
              {resendMutation.isError && (
                <p style={{ fontSize: '12px', color: 'var(--red)', margin: 0 }}>
                  {getApiErrorMessage(resendMutation.error, 'Failed to resend email.')}
                </p>
              )}
            </div>

            <div className="w-full flex items-center justify-between gap-4 py-2">
              <div style={{ flex: 1, height: '0.5px', backgroundColor: 'var(--border-default)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: '0.5px', backgroundColor: 'var(--border-default)' }} />
            </div>

            <Link 
              to="/login" 
              style={{ 
                fontSize: '13px', 
                color: 'var(--text-secondary)', 
                textDecoration: 'none',
                display: 'inline-block'
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>

        {/* Footer metadata row */}
        <div 
          className="grid grid-cols-2 gap-4 mt-8 text-center"
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          <div>Secure Verification</div>
          <div>Trial Pending</div>
        </div>
      </div>
    </div>
  );
}
