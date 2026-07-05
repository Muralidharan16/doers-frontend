import { CalendarDays, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { PlatformBillingSummary } from '../types';
import { formatBillingDate, getAccessCopy } from '../utils/messages';

export function PlatformBillingSummaryCard({ summary }: { summary: PlatformBillingSummary }) {
  const copy = getAccessCopy(summary.access.mode, summary.decision_availability.available);
  const badgeVariant = summary.access.mode === 'full' ? 'healthy' : summary.access.mode === 'limited_write' ? 'gold' : 'warning';

  return (
    <Card className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <ShieldCheck size={18} className="text-[var(--accent)]" />
            <h2 className="text-[18px] font-semibold tracking-tight">{copy.title}</h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-2xl">{copy.body}</p>
        </div>
        <Badge variant={badgeVariant}>{summary.access.mode.replace('_', ' ')}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
        <div>
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.12em]">Plan</div>
          <div className="font-medium text-[var(--text-primary)] mt-1">{summary.plan.display_name ?? 'Plan pending'}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.12em]">Current Period</div>
          <div className="font-medium text-[var(--text-primary)] mt-1">
            {formatBillingDate(summary.billing_period.period_start)} - {formatBillingDate(summary.billing_period.period_end)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.12em]">Next Change</div>
          <div className="font-medium text-[var(--text-primary)] mt-1 flex items-center gap-2">
            <CalendarDays size={14} className="text-[var(--text-muted)]" />
            {formatBillingDate(summary.access.next_transition_at)}
          </div>
        </div>
      </div>
    </Card>
  );
}
