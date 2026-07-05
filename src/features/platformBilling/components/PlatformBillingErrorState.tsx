import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlatformBillingReadError } from '../api/platformBillingApi';

function errorMessage(error: Error | null): string {
  if (error instanceof PlatformBillingReadError) {
    if (error.kind === 'denied') return 'You do not have permission to view Doers Plan & Billing.';
    if (error.kind === 'not_found') return 'Doers Plan & Billing is currently unavailable.';
    if (error.kind === 'rate_limited') return 'Billing information is temporarily rate limited. Try again shortly.';
    if (error.kind === 'validation') return 'Billing information could not be safely read.';
  }
  return 'Billing information is temporarily unavailable.';
}

export function PlatformBillingErrorState({ error, onRetry, title = 'Billing section unavailable' }: {
  error: Error | null;
  onRetry: () => void;
  title?: string;
}) {
  return (
    <Card className="space-y-4" role="alert">
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{errorMessage(error)}</p>
      </div>
      <Button type="button" variant="secondary" onClick={onRetry}>
        <RefreshCw size={14} />
        Retry
      </Button>
    </Card>
  );
}
