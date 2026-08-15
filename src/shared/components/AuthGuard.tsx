import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import {
  isSignedOutStorageEvent,
} from '@/features/auth/store/authStore';
import { authApi } from '@/features/auth/services/authApi';

export function AuthGuard({
  children,
  requireOnboarding = true,
}: {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}) {
  const status = useAuthStore((state) => state.status);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);
  const setSession = useAuthStore((state) => state.setSession);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: authApi.getSession,
    enabled: status === 'unknown',
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (status !== 'unknown') return;
    if (sessionQuery.data) {
      setSession(sessionQuery.data.user, sessionQuery.data.onboarding_completed);
    } else if (sessionQuery.isError) {
      clearAuth();
    }
  }, [clearAuth, sessionQuery.data, sessionQuery.isError, setSession, status]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (isSignedOutStorageEvent(event)) {
        clearAuth();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [clearAuth]);

  if (status === 'unknown') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] text-[var(--text-muted)]"
      >
        Restoring secure session…
      </div>
    );
  }

  if (status !== 'authenticated') return <Navigate to="/login" replace />;
  if (requireOnboarding && !onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
