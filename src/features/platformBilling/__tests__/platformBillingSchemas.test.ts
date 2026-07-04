import { describe, expect, it } from 'vitest';
import {
  platformBillingCheckoutOptionsSchema,
  platformBillingSummarySchema,
} from '../schemas/platformBillingSchemas';
import {
  platformBillingCheckoutOptionsFixture,
  platformBillingSummaryFixture,
} from '@/test/handlers/platformBillingHandlers';

function checkoutFixture() {
  return structuredClone(platformBillingCheckoutOptionsFixture);
}

function summaryFixture() {
  return structuredClone(platformBillingSummaryFixture);
}

describe('Platform Billing runtime schemas', () => {
  it('accepts valid summary and checkout-options payloads', () => {
    expect(platformBillingSummarySchema.parse(summaryFixture()).schema_version).toBe(1);
    expect(platformBillingCheckoutOptionsSchema.parse(checkoutFixture()).schema_version).toBe('platform-billing-checkout-options-v1');
  });

  it('accepts nullable fields exactly where the backend permits them', () => {
    const parsed = platformBillingCheckoutOptionsSchema.parse(checkoutFixture());
    expect(parsed.current_subscription.status).toBeNull();
    expect(parsed.current_subscription.current_plan_display_name).toBeNull();
    expect(parsed.current_subscription.period_type).toBeNull();
  });

  it('rejects unknown required enum values', () => {
    const payload = checkoutFixture();
    (payload.actions[0] as { action_code: string }).action_code = 'upgrade_subscription';
    expect(() => platformBillingCheckoutOptionsSchema.parse(payload)).toThrow();
  });

  it('rejects unexpected fields from the strict backend contract', () => {
    const payload = checkoutFixture() as Record<string, unknown>;
    payload.provider_customer_ref = 'cus_secret';
    expect(() => platformBillingCheckoutOptionsSchema.parse(payload)).toThrow();
  });

  it('rejects invalid, negative and unsafe amount_minor values', () => {
    const invalid = checkoutFixture();
    invalid.plans[0].prices[0].amount_minor = 12.5;
    expect(() => platformBillingCheckoutOptionsSchema.parse(invalid)).toThrow();

    const negative = checkoutFixture();
    negative.plans[0].prices[0].amount_minor = -1;
    expect(() => platformBillingCheckoutOptionsSchema.parse(negative)).toThrow();

    const unsafe = checkoutFixture();
    unsafe.plans[0].prices[0].amount_minor = Number.MAX_SAFE_INTEGER + 10;
    expect(() => platformBillingCheckoutOptionsSchema.parse(unsafe)).toThrow();
  });

  it('rejects invalid interval_count and currency values', () => {
    const interval = checkoutFixture();
    interval.plans[0].prices[0].interval_count = 0;
    expect(() => platformBillingCheckoutOptionsSchema.parse(interval)).toThrow();

    const currency = checkoutFixture();
    currency.plans[0].prices[0].currency = 'inr';
    expect(() => platformBillingCheckoutOptionsSchema.parse(currency)).toThrow();
  });

  it('rejects malformed diagnostics', () => {
    const payload = checkoutFixture();
    (payload.diagnostics.fake_checkout_simulation as { allowed_outcomes: string[] }).allowed_outcomes = ['done'];
    expect(() => platformBillingCheckoutOptionsSchema.parse(payload)).toThrow();
  });
});
