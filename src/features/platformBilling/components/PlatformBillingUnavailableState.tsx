import { AlertTriangle } from 'lucide-react';

export function PlatformBillingUnavailableState() {
  return (
    <div className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]" role="status">
      <AlertTriangle size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-semibold text-[var(--text-primary)]">Account status is temporarily unavailable</div>
        <div className="text-[12px] text-[var(--text-muted)] mt-1">
          Existing information remains safe. Try again shortly or contact support if this continues.
        </div>
      </div>
    </div>
  );
}
