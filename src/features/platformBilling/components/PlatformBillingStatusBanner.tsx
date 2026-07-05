import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PLATFORM_BILLING_FRONTEND_SHELL } from '@/config/flags';
import { usePlatformBillingSummary } from '../hooks/usePlatformBillingSummary';
import { getAccessCopy } from '../utils/messages';

export function PlatformBillingStatusBanner() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const { data, isError } = usePlatformBillingSummary(PLATFORM_BILLING_FRONTEND_SHELL);

  if (!PLATFORM_BILLING_FRONTEND_SHELL || dismissed) return null;
  if (!data && !isError) return null;

  const mode = data?.access.mode ?? 'read_only';
  const available = data?.decision_availability.available ?? false;
  if (mode === 'full' && available) return null;

  const copy = getAccessCopy(mode, available);

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[100] w-[92%] max-w-3xl">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3 min-w-0">
          <AlertCircle size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">{copy.title}</div>
            <div className="text-[12px] text-[var(--text-secondary)] mt-1">{copy.body}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigate('/settings/plan-billing')}
            className="inline-flex items-center gap-2 text-[12px] font-medium text-[var(--accent)]"
          >
            <span>Plan & Billing</span>
            <ArrowRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Dismiss billing status"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
