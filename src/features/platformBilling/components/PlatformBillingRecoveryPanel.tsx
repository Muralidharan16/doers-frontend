import { LifeBuoy } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const ACTION_LABELS: Record<string, string> = {
  VIEW_PLAN_BILLING: 'Review billing status',
  CONTACT_SUPPORT: 'Contact support',
  EXPORT_DATA: 'Export data',
  DOWNLOAD_INVOICES: 'Download invoices',
  UPDATE_PAYMENT_METHOD: 'Update payment method',
  COMPLETE_PAYMENT_ACTION: 'Complete payment action',
  UNDO_CANCELLATION: 'Undo cancellation',
};

export function PlatformBillingRecoveryPanel({ actions }: { actions: string[] }) {
  const safeActions = actions.filter((action) => ACTION_LABELS[action]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <LifeBuoy size={17} className="text-[var(--accent)]" />
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Recovery</h2>
      </div>
      <p className="text-[13px] text-[var(--text-secondary)]">
        These options stay available so account issues can be resolved without losing access to support.
      </p>
      {safeActions.length === 0 ? (
        <div className="text-[12px] text-[var(--text-muted)]">Support can help review the account status.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {safeActions.map((action) => (
            <span
              key={action}
              className="inline-flex items-center border border-[var(--border-strong)] rounded-[var(--radius-sm)] px-3 py-2 text-[12px] text-[var(--text-secondary)]"
            >
              {ACTION_LABELS[action]}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
