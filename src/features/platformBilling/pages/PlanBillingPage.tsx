import { PLATFORM_BILLING_FRONTEND_SHELL } from '@/config/flags';
import { PageHeader } from '@/components/ui/PageHeader';
import { AvailablePlatformPlans } from '../components/AvailablePlatformPlans';
import { CheckoutAvailabilityNotice } from '../components/CheckoutAvailabilityNotice';
import { CurrentPlatformPlanCard } from '../components/CurrentPlatformPlanCard';
import { PlatformBillingErrorState } from '../components/PlatformBillingErrorState';
import { PlatformBillingLoadingState } from '../components/PlatformBillingLoadingState';
import { PlatformBillingRecoveryPanel } from '../components/PlatformBillingRecoveryPanel';
import { PlatformBillingSummaryCard } from '../components/PlatformBillingSummaryCard';
import { PlatformBillingUsageCard } from '../components/PlatformBillingUsageCard';
import { usePlatformBillingCheckoutOptions } from '../hooks/usePlatformBillingCheckoutOptions';
import { usePlatformBillingSummary } from '../hooks/usePlatformBillingSummary';

export function PlanBillingPage({ embedded = false }: { embedded?: boolean }) {
  const summaryQuery = usePlatformBillingSummary(PLATFORM_BILLING_FRONTEND_SHELL);
  const optionsQuery = usePlatformBillingCheckoutOptions(PLATFORM_BILLING_FRONTEND_SHELL);

  if (!PLATFORM_BILLING_FRONTEND_SHELL) return null;

  const isInitialLoading = (summaryQuery.isLoading || optionsQuery.isLoading) && !summaryQuery.data && !optionsQuery.data;

  return (
    <div className="space-y-6">
      {!embedded && <PageHeader title="Doers Plan & Billing" category="Organization Settings" />}

      {isInitialLoading && <PlatformBillingLoadingState />}

      {summaryQuery.data ? (
        <>
          <PlatformBillingSummaryCard summary={summaryQuery.data} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PlatformBillingUsageCard usage={summaryQuery.data.usage} />
            <PlatformBillingRecoveryPanel actions={summaryQuery.data.access.recovery_actions} />
          </div>
        </>
      ) : summaryQuery.isError ? (
        <PlatformBillingErrorState
          title="Account summary unavailable"
          error={summaryQuery.error}
          onRetry={() => void summaryQuery.refetch()}
        />
      ) : null}

      {optionsQuery.data ? (
        <>
          <CurrentPlatformPlanCard currentSubscription={optionsQuery.data.current_subscription} />
          <AvailablePlatformPlans plans={optionsQuery.data.plans} />
          <CheckoutAvailabilityNotice availability={optionsQuery.data.checkout_availability} />
        </>
      ) : optionsQuery.isError ? (
        <PlatformBillingErrorState
          title="Doers plan options unavailable"
          error={optionsQuery.error}
          onRetry={() => void optionsQuery.refetch()}
        />
      ) : !isInitialLoading ? (
        <PlatformBillingLoadingState />
      ) : null}
    </div>
  );
}

export default PlanBillingPage;
