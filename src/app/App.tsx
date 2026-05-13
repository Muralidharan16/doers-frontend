import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Providers } from './providers';
import { AuthGuard } from '@/shared/components/AuthGuard';
import { TrialLockBanner } from '@/features/trial';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const SignupPage = lazy(() => import('@/pages/auth/signup/page'));
const CheckInboxPage = lazy(() => import('@/pages/auth/check-inbox/page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/page'));
const DashboardPage = lazy(() => import('@/pages/dashboard/page'));
const SubscriptionRequiredPage = lazy(() => import('@/pages/subscription-required/page'));

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <TrialLockBanner />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/check-inbox" element={<CheckInboxPage />} />
            <Route path="/onboarding" element={
              <AuthGuard requireOnboarding={false}>
                <OnboardingPage />
              </AuthGuard>
            } />
            <Route path="/subscription-required" element={<SubscriptionRequiredPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
