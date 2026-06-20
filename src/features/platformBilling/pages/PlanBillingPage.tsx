import { RefreshCw } from 'lucide-react';
import { PLATFORM_BILLING_FRONTEND_SHELL } from '@/config/flags';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { PlatformBillingRecoveryPanel } from '../components/PlatformBillingRecoveryPanel';
import { PlatformBillingSummaryCard } from '../components/PlatformBillingSummaryCard';
import { PlatformBillingUnavailableState } from '../components/PlatformBillingUnavailableState';
import { PlatformBillingUsageCard } from '../components/PlatformBillingUsageCard';
import { usePlatformBillingSummary } from '../hooks/usePlatformBillingSummary';

export function PlanBillingPage({ embedded = false }: { embedded?: boolean }) {
  const query = usePlatformBillingSummary(PLATFORM_BILLING_FRONTEND_SHELL);

  if (!PLATFORM_BILLING_FRONTEND_SHELL) return null;

  return (
    <div className="space-y-6">
      {!embedded && <PageHeader title="Plan & Billing" category="Settings" />}

      {query.isLoading && (
        <Card className="text-[13px] text-[var(--text-muted)]">Loading account status...</Card>
      )}

      {query.isError && (
        <Card className="space-y-4">
          <PlatformBillingUnavailableState />
          <Button type="button" variant="secondary" onClick={() => query.refetch()}>
            <RefreshCw size={14} />
            Check again
          </Button>
        </Card>
      )}

      {query.data && (
        <>
          <PlatformBillingSummaryCard summary={query.data} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PlatformBillingUsageCard usage={query.data.usage} />
            <PlatformBillingRecoveryPanel actions={query.data.access.recovery_actions} />
          </div>
        </>
      )}
    </div>
  );
}

export default PlanBillingPage;
