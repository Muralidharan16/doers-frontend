import { CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { PlatformBillingCheckoutOptions } from '../types';

const STATUS_LABELS: Record<string, string> = {
  active: 'Active subscription',
  trialing: 'Trial subscription',
  cancel_scheduled: 'Cancellation scheduled',
  canceled: 'Canceled subscription',
  expired: 'Expired subscription',
};

function subscriptionStatusLabel(status: string | null): string {
  if (!status) return 'No active Doers platform subscription';
  return STATUS_LABELS[status] ?? 'Doers platform subscription';
}

export function CurrentPlatformPlanCard({ currentSubscription }: {
  currentSubscription: PlatformBillingCheckoutOptions['current_subscription'];
}) {
  const hasSubscription = currentSubscription.status !== null;

  return (
    <Card className="space-y-4" aria-labelledby="current-doers-plan-heading">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            {hasSubscription ? <CheckCircle2 size={17} className="text-[var(--green)]" /> : <Clock3 size={17} className="text-[var(--text-muted)]" />}
            <h2 id="current-doers-plan-heading" className="text-[15px] font-semibold">
              Current Doers plan
            </h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)]">
            {currentSubscription.current_plan_display_name ?? 'No active Doers platform subscription'}
          </p>
        </div>
        <Badge variant={hasSubscription ? 'healthy' : 'muted'}>{subscriptionStatusLabel(currentSubscription.status)}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Period type</div>
          <div className="mt-1 font-medium text-[var(--text-primary)]">{currentSubscription.period_type ?? 'Not scheduled'}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Cancellation</div>
          <div className="mt-1 font-medium text-[var(--text-primary)]">
            {currentSubscription.cancel_at_period_end ? 'Cancellation scheduled' : 'No scheduled cancellation'}
          </div>
        </div>
      </div>
    </Card>
  );
}
