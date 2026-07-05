import { z } from "zod";

const isoDateTime = z.string().datetime({ offset: true });
const nullableIsoDateTime = isoDateTime.nullable();
const currencyCode = z.string().regex(/^[A-Z]{3}$/);

const entitlementValueSchema = z.union([
  z.boolean(),
  z.number(),
  z.string(),
  z.record(z.string(), z.unknown()),
]);

export const platformBillingSummarySchema = z.strictObject({
  schema_version: z.number().int(),
  organization_id: z.string().uuid(),
  access: z.strictObject({
    mode: z.enum([
      "full",
      "limited_write",
      "read_only",
      "billing_only",
      "blocked",
    ]),
    safe_reason_code: z.string(),
    effective_from: nullableIsoDateTime,
    next_transition_at: nullableIsoDateTime,
    recovery_actions: z.array(z.string()),
    projection_freshness: z.string(),
  }),
  plan: z.strictObject({
    code: z.string().nullable(),
    display_name: z.string().nullable(),
    status: z.string().nullable(),
  }),
  billing_period: z.strictObject({
    period_start: nullableIsoDateTime,
    period_end: nullableIsoDateTime,
    subscription_status: z.string().nullable(),
    cancel_at_period_end: z.boolean(),
  }),
  entitlements: z.array(
    z.strictObject({
      key: z.string(),
      value_type: z.enum(["boolean", "integer", "string", "json"]),
      value: entitlementValueSchema,
    }),
  ),
  usage: z.array(
    z.strictObject({
      key: z.string(),
      current: z.number(),
      limit: z.number().nullable(),
      over_limit: z.boolean().nullable(),
      stale_after: nullableIsoDateTime,
    }),
  ),
  decision_availability: z.strictObject({
    available: z.boolean(),
    reason: z.string().nullable(),
  }),
  server_time: isoDateTime,
});

export const platformBillingCurrentSubscriptionOptionSchema = z.strictObject({
  status: z
    .enum(["active", "trialing", "cancel_scheduled", "canceled", "expired"])
    .nullable(),
  current_plan_code: z.string().nullable(),
  current_plan_display_name: z.string().nullable(),
  period_type: z.string().nullable(),
  cancel_at_period_end: z.boolean(),
});

export const platformBillingPriceOptionSchema = z.strictObject({
  billing_interval: z.enum(["month", "year", "one_time"]),
  interval_count: z.number().int().positive(),
  amount_minor: z.number().int().nonnegative().safe(),
  currency: currencyCode,
  tax_behavior: z.enum(["exclusive", "inclusive", "not_applicable"]),
});

export const platformBillingPlanOptionSchema = z.strictObject({
  plan_code: z.string().min(1),
  display_name: z.string().min(1),
  description: z.string().nullable(),
  is_current: z.boolean(),
  prices: z.array(platformBillingPriceOptionSchema),
  feature_summary: z.array(z.string()),
});

export const platformBillingActionOptionSchema = z.strictObject({
  action_code: z.literal("start_subscription"),
  target_plan_code: z.string().nullable(),
  billing_interval: z.enum(["month", "year", "one_time"]).nullable(),
  display_label: z.string(),
  is_available: z.boolean(),
  unavailable_reason_code: z.string().nullable(),
  checkout_supported: z.boolean(),
  requires_confirmation: z.boolean(),
});

export const checkoutAvailabilityReasonCodeSchema = z.enum([
  "ACTION_NOT_PERMITTED",
  "CHECKOUT_FEATURE_DISABLED",
  "ENVIRONMENT_DENIED",
  "PROVIDER_MODE_UNAVAILABLE",
  "PROVIDER_CUSTOMER_MISSING",
  "CURRENT_SUBSCRIPTION_EXISTS",
  "ACTIVE_SUBSCRIPTION_EXISTS",
  "TRIAL_SUBSCRIPTION_EXISTS",
  "CANCELLATION_SCHEDULED",
  "NO_AVAILABLE_PLANS",
  "CATALOG_TERMS_UNAVAILABLE",
  "CATALOG_PRICE_AMBIGUOUS",
]);

export const platformBillingCheckoutAvailabilitySchema = z.strictObject({
  available: z.boolean(),
  reason_code: checkoutAvailabilityReasonCodeSchema.nullable(),
  message: z.string(),
  action_code: z.literal("start_subscription"),
});

export const fakeCheckoutSimulationOutcomeSchema = z.enum([
  "pending",
  "succeeded",
  "failed",
]);

export const fakeCheckoutSimulationAvailabilitySchema = z.strictObject({
  available: z.boolean(),
  allowed_outcomes: z.array(fakeCheckoutSimulationOutcomeSchema),
  warning: z.string(),
});

export const platformBillingCheckoutOptionsSchema = z.strictObject({
  schema_version: z.literal("platform-billing-checkout-options-v1"),
  server_time: isoDateTime,
  catalog_version: z.string().regex(/^platform-catalog-sha256:[0-9a-f]{64}$/),
  current_subscription: platformBillingCurrentSubscriptionOptionSchema,
  plans: z.array(platformBillingPlanOptionSchema),
  actions: z.array(platformBillingActionOptionSchema),
  checkout_availability: platformBillingCheckoutAvailabilitySchema,
  diagnostics: z.strictObject({
    fake_checkout_simulation: fakeCheckoutSimulationAvailabilitySchema,
  }),
});

export type PlatformBillingSummary = z.infer<
  typeof platformBillingSummarySchema
>;
export type PlatformBillingCheckoutOptions = z.infer<
  typeof platformBillingCheckoutOptionsSchema
>;
export type PlatformBillingPlanOption = z.infer<
  typeof platformBillingPlanOptionSchema
>;
export type PlatformBillingPriceOption = z.infer<
  typeof platformBillingPriceOptionSchema
>;
export type PlatformBillingActionOption = z.infer<
  typeof platformBillingActionOptionSchema
>;
export type PlatformBillingCheckoutAvailability = z.infer<
  typeof platformBillingCheckoutAvailabilitySchema
>;

export const createCheckoutSessionRequestSchema = z.strictObject({
  plan_code: z.string().min(1).nullable().optional(),
  plan_id: z.string().uuid().nullable().optional(),
  billing_interval: z.enum(["month", "year", "one_time"]).nullable().optional(),
});

export const createCheckoutSessionResponseSchema = z.strictObject({
  operation_id: z.string().uuid(),
  operation_status: z.enum(["pending", "in_progress", "succeeded", "failed"]),
  checkout_session_reference: z.string().nullable(),
  fake_checkout_token: z.string().nullable(),
  expires_at: isoDateTime.nullable(),
  confirmation_state: z.string(),
  replayed: z.boolean(),
  browser_authoritative: z.boolean(),
});

export const getCheckoutOperationResponseSchema = z.strictObject({
  operation_id: z.string().uuid(),
  operation_status: z.enum(["pending", "in_progress", "succeeded", "failed"]),
  checkout_session_reference: z.string().nullable(),
  expires_at: isoDateTime.nullable(),
  error_code: z.string().nullable(),
  browser_authoritative: z.boolean(),
});

export const createFakeCheckoutSimulationRequestSchema = z.strictObject({
  checkout_operation_id: z.string().uuid(),
  requested_outcome: fakeCheckoutSimulationOutcomeSchema,
});

export const fakeCheckoutSimulationResponseSchema = z.strictObject({
  simulation_operation_id: z.string().uuid(),
  checkout_operation_id: z.string().uuid(),
  outcome_status: z.enum([
    "outcome_pending",
    "outcome_succeeded",
    "outcome_failed",
  ]),
  webhook_processing_status: z.string().nullable(),
  provider_event_reference: z.string().nullable(),
  replayed: z.boolean(),
  browser_authoritative: z.boolean(),
  subscription_activated: z.boolean(),
});

export type CreateCheckoutSessionRequest = z.infer<
  typeof createCheckoutSessionRequestSchema
>;
export type CreateCheckoutSessionResponse = z.infer<
  typeof createCheckoutSessionResponseSchema
>;
export type GetCheckoutOperationResponse = z.infer<
  typeof getCheckoutOperationResponseSchema
>;
export type FakeCheckoutSimulationOutcome = z.infer<
  typeof fakeCheckoutSimulationOutcomeSchema
>;
export type CreateFakeCheckoutSimulationRequest = z.infer<
  typeof createFakeCheckoutSimulationRequestSchema
>;
export type FakeCheckoutSimulationResponse = z.infer<
  typeof fakeCheckoutSimulationResponseSchema
>;
