import { http, HttpResponse } from 'msw';
import type { PlatformBillingCheckoutOptions, PlatformBillingSummary } from '@/features/platformBilling/schemas/platformBillingSchemas';

export const platformBillingSummaryFixture: PlatformBillingSummary = {
  schema_version: 1,
  organization_id: '550e8400-e29b-41d4-a716-446655440000',
  access: {
    mode: 'full',
    safe_reason_code: 'allowed',
    effective_from: null,
    next_transition_at: null,
    recovery_actions: [],
    projection_freshness: 'fresh',
  },
  plan: {
    code: 'DOERS-STARTER',
    display_name: 'Doers Starter',
    status: 'active',
  },
  billing_period: {
    period_start: null,
    period_end: null,
    subscription_status: null,
    cancel_at_period_end: false,
  },
  entitlements: [],
  usage: [],
  decision_availability: {
    available: true,
    reason: null,
  },
  server_time: '2026-07-02T12:00:00Z',
};

export const platformBillingCheckoutOptionsFixture: PlatformBillingCheckoutOptions = {
  schema_version: 'platform-billing-checkout-options-v1',
  server_time: '2026-07-02T12:00:00Z',
  catalog_version: `platform-catalog-sha256:${'a'.repeat(64)}`,
  current_subscription: {
    status: null,
    current_plan_code: null,
    current_plan_display_name: null,
    period_type: null,
    cancel_at_period_end: false,
  },
  plans: [
    {
      plan_code: 'DOERS-STARTER',
      display_name: 'Doers Starter',
      description: 'Backend provided starter platform plan.',
      is_current: false,
      prices: [
        {
          billing_interval: 'month',
          interval_count: 1,
          amount_minor: 99900,
          currency: 'INR',
          tax_behavior: 'exclusive',
        },
        {
          billing_interval: 'year',
          interval_count: 1,
          amount_minor: 12345,
          currency: 'USD',
          tax_behavior: 'exclusive',
        },
      ],
      feature_summary: [],
    },
    {
      plan_code: 'DOERS-JPY',
      display_name: 'Doers JPY',
      description: 'Backend provided zero-decimal platform plan.',
      is_current: false,
      prices: [
        {
          billing_interval: 'month',
          interval_count: 1,
          amount_minor: 999,
          currency: 'JPY',
          tax_behavior: 'not_applicable',
        },
      ],
      feature_summary: [],
    },
  ],
  actions: [
    {
      action_code: 'start_subscription',
      target_plan_code: 'DOERS-STARTER',
      billing_interval: 'month',
      display_label: 'Start subscription',
      is_available: true,
      unavailable_reason_code: null,
      checkout_supported: true,
      requires_confirmation: true,
    },
  ],
  checkout_availability: {
    available: true,
    reason_code: null,
    message: 'Platform Billing checkout is available.',
    action_code: 'start_subscription',
  },
  diagnostics: {
    fake_checkout_simulation: {
      available: false,
      allowed_outcomes: [],
      warning: 'Development test simulation. No real payment is performed. No subscription is activated.',
    },
  },
};

export const platformBillingHandlers = [
  http.get('*/api/v1/platform-billing/summary', () => HttpResponse.json(platformBillingSummaryFixture)),
  http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json(platformBillingCheckoutOptionsFixture)),
];
