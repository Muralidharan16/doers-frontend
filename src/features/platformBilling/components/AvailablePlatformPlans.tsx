import { Layers3 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { PlatformBillingPlanOption, PlatformBillingPriceOption } from '../types';
import { formatMinorCurrency } from '../utils/money';

function intervalLabel(price: PlatformBillingPriceOption): string {
  if (price.billing_interval === 'one_time') return 'One time';
  const unit = price.billing_interval === 'month' ? 'month' : 'year';
  return price.interval_count === 1 ? `Per ${unit}` : `Every ${price.interval_count} ${unit}s`;
}

function taxLabel(taxBehavior: PlatformBillingPriceOption['tax_behavior']): string {
  if (taxBehavior === 'inclusive') return 'Tax included';
  if (taxBehavior === 'exclusive') return 'Tax additional where applicable';
  return 'Tax not applicable';
}

export function AvailablePlatformPlans({ plans }: { plans: PlatformBillingPlanOption[] }) {
  return (
    <Card className="space-y-4" aria-labelledby="available-platform-plans-heading">
      <div className="flex items-center gap-2">
        <Layers3 size={17} className="text-[var(--accent)]" />
        <h2 id="available-platform-plans-heading" className="text-[15px] font-semibold text-[var(--text-primary)]">
          Available Platform plans
        </h2>
      </div>

      {plans.length === 0 ? (
        <p className="text-[13px] text-[var(--text-muted)]">No Doers platform plans are currently available.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <article
              key={plan.plan_code}
              className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-4 space-y-4"
              aria-label={plan.display_name}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{plan.display_name}</h3>
                  {plan.description && <p className="text-[12px] text-[var(--text-muted)]">{plan.description}</p>}
                </div>
                {plan.is_current && <Badge variant="healthy">Current plan</Badge>}
              </div>

              <div className="space-y-3">
                {plan.prices.map((price) => (
                  <div
                    key={`${plan.plan_code}-${price.billing_interval}-${price.currency}-${price.amount_minor}`}
                    className="rounded-[var(--radius-sm)] bg-[var(--bg-page)] border border-[var(--border-default)] p-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <div className="text-[16px] font-semibold text-[var(--text-primary)]">
                        {formatMinorCurrency(price.amount_minor, price.currency) ?? 'Price unavailable'}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{intervalLabel(price)}</div>
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--text-muted)]">{taxLabel(price.tax_behavior)}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}
