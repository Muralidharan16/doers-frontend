import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

export function AuthGuard({
  children,
  requireOnboarding = true,
}: {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireOnboarding && !onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
