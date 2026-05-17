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
const SettingsPage = lazy(() => import('@/pages/settings/page'));
const SubscriptionRequiredPage = lazy(() => import('@/pages/subscription-required/page'));

// New screens lazy imports
const MembersPage = lazy(() => import('@/pages/members/page'));
const SubscriptionsPage = lazy(() => import('@/pages/subscriptions/page'));
const PaymentsPage = lazy(() => import('@/pages/billing/page'));
const ReportsPage = lazy(() => import('@/pages/reports/page'));
const AttendancePage = lazy(() => import('@/pages/attendance/page'));
const GymsPage = lazy(() => import('@/pages/gyms/page'));

// Classical Luxury Suspense fallback
const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] animate-fade-in">
    <div className="flex flex-col items-center gap-8">
      <div className="w-10 h-10 rounded-sm border-[1px] border-[var(--border-strong)] border-t-[var(--accent)] animate-spin" />
      <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-mono animate-pulse">
        Initializing Registry Experience
      </div>
    </div>
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
      {
        path: 'members',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><MembersPage /></Suspense>,
          }
        ]
      },
      {
        path: 'subscriptions',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><SubscriptionsPage /></Suspense>,
          }
        ]
      },
      {
        path: 'billing',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><PaymentsPage /></Suspense>,
          }
        ]
      },
      {
        path: 'reports',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><ReportsPage /></Suspense>,
          }
        ]
      },
      {
        path: 'attendance',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><AttendancePage /></Suspense>,
          }
        ]
      },
      {
        path: 'gyms',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><GymsPage /></Suspense>,
          }
        ]
      },
      {
        path: 'settings',
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Suspense fallback={<Fallback />}><SettingsPage /></Suspense>,
          }
        ]
      },
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}