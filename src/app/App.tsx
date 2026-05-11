import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Providers } from './providers';
import { AuthGuard } from '@/shared/components/AuthGuard';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const DashboardPage = lazy(() => import('@/pages/dashboard/page'));

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
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