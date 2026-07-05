import { Navigate } from 'react-router-dom';
import { PLATFORM_BILLING_FRONTEND_SHELL } from '@/config/flags';
import { PlanBillingPage } from './PlanBillingPage';

export function BillingRecoveryPage() {
  if (!PLATFORM_BILLING_FRONTEND_SHELL) {
    return <Navigate to="/subscription-required" replace />;
  }

  return <PlanBillingPage />;
}

export default BillingRecoveryPage;
