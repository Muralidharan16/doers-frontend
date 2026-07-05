import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { PlatformBillingUsageSummary } from '../types';
import { formatEntitlementKey } from '../utils/messages';

export function PlatformBillingUsageCard({ usage }: { usage: PlatformBillingUsageSummary[] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={17} className="text-[var(--accent)]" />
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Usage and Limits</h2>
      </div>

      {usage.length === 0 ? (
        <div className="text-[13px] text-[var(--text-muted)]">No usage limits are available yet.</div>
      ) : (
        <div className="space-y-4">
          {usage.map((item) => {
            const percent = item.limit && item.limit > 0 ? Math.min(100, Math.round((item.current / item.limit) * 100)) : 0;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-[12px]">
                  <span className="font-medium text-[var(--text-primary)]">{formatEntitlementKey(item.key)}</span>
                  <span className="text-[var(--text-muted)]">
                    {item.limit === null ? `${item.current} used` : `${item.current} / ${item.limit}`}
                  </span>
                </div>
                <div className="h-2 rounded-sm bg-[var(--bg-page)] overflow-hidden border border-[var(--border-default)]">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: item.limit === null ? '0%' : `${percent}%`,
                      backgroundColor: item.over_limit ? 'var(--red)' : 'var(--accent)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
