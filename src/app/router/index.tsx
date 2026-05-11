import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const DashboardPage = lazy(() => import('@/pages/dashboard/page'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Redirect logic here</div>, // simple redirect to login
  },
  {
    path: '/login',
    element: <Suspense fallback={<div>Loading...</div>}><LoginPage /></Suspense>,
  },
  {
    path: '/dashboard',
    element: <Suspense fallback={<div>Loading...</div>}><DashboardPage /></Suspense>,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}