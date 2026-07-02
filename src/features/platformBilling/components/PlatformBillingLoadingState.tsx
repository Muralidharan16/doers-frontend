import { Card } from '@/components/ui/Card';

export function PlatformBillingLoadingState() {
  return (
    <Card className="text-[13px] text-[var(--text-muted)]" role="status" aria-live="polite">
      Loading Doers Plan & Billing...
    </Card>
  );
}
