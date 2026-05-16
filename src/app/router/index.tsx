import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthGuard } from '@/shared/components/AuthGuard';
import { TrialLockBanner } from '@/features/trial';
import DashboardLayout from '@/pages/_layouts/DashboardLayout';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const SignupPage = lazy(() => import('@/pages/auth/signup/page'));
const CheckInboxPage = lazy(() => import('@/pages/auth/check-inbox/page'));
const VerifySuccessPage = lazy(() => import('@/pages/auth/verify-success/page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/page'));
const DashboardPage = lazy(() => import('@/pages/dashboard/page'));
const SubscriptionRequiredPage = lazy(() => import('@/pages/subscription-required/page'));

// Neutral Suspense fallback as requested
const Fallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f3ef'
  }}>
    <div style={{ color: '#1a1a1a', fontSize: '14px', fontFamily: 'sans-serif' }}>Loading...</div>
  </div>
);

// Root layout to include TrialLockBanner within Router context
const RootLayout = () => (
  <>
    <TrialLockBanner />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <Suspense fallback={<Fallback />}><LoginPage /></Suspense>,
      },
      {
        path: 'signup',
        element: <Suspense fallback={<Fallback />}><SignupPage /></Suspense>,
      },
      {
        path: 'check-inbox',
        element: <Suspense fallback={<Fallback />}><CheckInboxPage /></Suspense>,
      },
      {
        path: 'auth/verify-success',
        element: <Suspense fallback={<Fallback />}><VerifySuccessPage /></Suspense>,
      },
      {
        path: 'onboarding',
        element: (
          <AuthGuard requireOnboarding={false}>
            <Suspense fallback={<Fallback />}><OnboardingPage /></Suspense>
          </AuthGuard>
        ),
      },
      {
        path: 'subscription-required',
        element: <Suspense fallback={<Fallback />}><SubscriptionRequiredPage /></Suspense>,
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><DashboardPage /></Suspense>,
          }
        ]
      },
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}