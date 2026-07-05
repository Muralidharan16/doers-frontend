import { http, HttpResponse } from "msw";
import type {
  PlatformBillingCheckoutOptions,
  PlatformBillingSummary,
} from "@/features/platformBilling/schemas/platformBillingSchemas";

export const platformBillingSummaryFixture: PlatformBillingSummary = {
  schema_version: 1,
  organization_id: "550e8400-e29b-41d4-a716-446655440000",
  access: {
    mode: "full",
    safe_reason_code: "allowed",
    effective_from: null,
    next_transition_at: null,
    recovery_actions: [],
    projection_freshness: "fresh",
  },
  plan: {
    code: "DOERS-STARTER",
    display_name: "Doers Starter",
    status: "active",
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
  server_time: "2026-07-02T12:00:00Z",
};

export const platformBillingCheckoutOptionsFixture: PlatformBillingCheckoutOptions =
  {
    schema_version: "platform-billing-checkout-options-v1",
    server_time: "2026-07-02T12:00:00Z",
    catalog_version: `platform-catalog-sha256:${"a".repeat(64)}`,
    current_subscription: {
      status: null,
      current_plan_code: null,
      current_plan_display_name: null,
      period_type: null,
      cancel_at_period_end: false,
    },
    plans: [
      {
        plan_code: "DOERS-STARTER",
        display_name: "Doers Starter",
        description: "Backend provided starter platform plan.",
        is_current: false,
        prices: [
          {
            billing_interval: "month",
            interval_count: 1,
            amount_minor: 99900,
            currency: "INR",
            tax_behavior: "exclusive",
          },
          {
            billing_interval: "year",
            interval_count: 1,
            amount_minor: 12345,
            currency: "USD",
            tax_behavior: "exclusive",
          },
        ],
        feature_summary: [],
      },
      {
        plan_code: "DOERS-JPY",
        display_name: "Doers JPY",
        description: "Backend provided zero-decimal platform plan.",
        is_current: false,
        prices: [
          {
            billing_interval: "month",
            interval_count: 1,
            amount_minor: 999,
            currency: "JPY",
            tax_behavior: "not_applicable",
          },
        ],
        feature_summary: [],
      },
    ],
    actions: [
      {
        action_code: "start_subscription",
        target_plan_code: "DOERS-STARTER",
        billing_interval: "month",
        display_label: "Start subscription",
        is_available: true,
        unavailable_reason_code: null,
        checkout_supported: true,
        requires_confirmation: true,
      },
    ],
    checkout_availability: {
      available: true,
      reason_code: null,
      message: "Platform Billing checkout is available.",
      action_code: "start_subscription",
    },
    diagnostics: {
      fake_checkout_simulation: {
        available: false,
        allowed_outcomes: [],
        warning:
          "Development test simulation. No real payment is performed. No subscription is activated.",
      },
    },
  };

export const platformBillingHandlers = [
  http.get("*/api/v1/platform-billing/summary", () =>
    HttpResponse.json(platformBillingSummaryFixture),
  ),
  http.get("*/api/v1/platform-billing/checkout-options", () =>
    HttpResponse.json(platformBillingCheckoutOptionsFixture),
  ),
];

/*
 Handler notes:
 - Tests may set header 'x-msw-scenario' to instruct the handler to return specific scenarios.
 - Idempotency is simulated via in-memory map keyed by 'Idempotency-Key'.
 - Operations are stored in-memory and can be returned via GET /checkout-operations/:operation_id
*/

const idempotencyStore = new Map<string, Record<string, unknown>>();
const operationsStore = new Map<string, Record<string, unknown>>();
const simulationStore = new Map<string, Record<string, unknown>>();

function makeUuid() {
  try {
    return globalThis.crypto?.randomUUID?.() ?? "00000000-0000-4000-8000-000000000000";
  } catch {
    return "00000000-0000-4000-8000-000000000000";
  }
}

function makeOperation(status: "pending" | "in_progress" | "succeeded" | "failed", opts: Record<string, unknown> = {}) {
  return {
    operation_id: makeUuid(),
    operation_status: status,
    checkout_session_reference: null,
    expires_at: null,
    error_code: null,
    browser_authoritative: false,
    ...opts,
  };
}

// POST handler for creating checkout sessions
platformBillingHandlers.push(
  http.post(
    "*/api/v1/platform-billing/checkout-sessions",
    async ({ request }) => {
      const scenario = request.headers.get("x-msw-scenario") || "";
      const idKey = request.headers.get("Idempotency-Key") || "";

      // Simulate header validation
      if (idKey && !/^[A-Za-z0-9_-]{16,160}$/.test(idKey)) {
        return HttpResponse.json(
          { detail: "Invalid Idempotency-Key" },
          { status: 422 },
        );
      }

      // Simulate auth error
      if (scenario === "403")
        return HttpResponse.json({ detail: "forbidden" }, { status: 403 });
      if (scenario === "429")
        return HttpResponse.json({ detail: "rate_limited" }, { status: 429 });
      if (scenario === "409")
        return HttpResponse.json({ detail: "conflict" }, { status: 409 });
      if (scenario === "500")
        return HttpResponse.json({ detail: "server" }, { status: 500 });

      // Parse body where present (MSW provides .json())
      let body: unknown = {};
      try {
        body = await request.json();
      } catch {
        // ignore
      }

      // Browser authoritative scenario: return browser_authoritative flag true
      if (scenario === "browser_authoritative") {
        const op = makeOperation("pending", { browser_authoritative: true });
        operationsStore.set(op.operation_id, op);
        const resp = {
          operation_id: op.operation_id,
          operation_status: op.operation_status,
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: "unconfirmed",
          replayed: false,
          browser_authoritative: true,
        };
        return HttpResponse.json(resp, { status: 201 });
      }

      // Idempotency replay: return same operation for same key
      if (idKey && idempotencyStore.has(idKey)) {
        return HttpResponse.json(
          idempotencyStore.get(idKey) as Record<string, unknown>,
          { status: 200 },
        );
      }

      // Basic validation: reject if body contains forbidden fields
      const forbidden = [
        "amount",
        "currency",
        "tenant_id",
        "organization_id",
        "provider_id",
        "provider_token",
      ];
      const b = body as Record<string, unknown>;
      for (const f of forbidden) {
        if (b && Object.prototype.hasOwnProperty.call(b, f)) {
          return HttpResponse.json(
            { detail: `forbidden field ${f}` },
            { status: 422 },
          );
        }
      }

      // Create operation and response
      const op = makeOperation("pending");
      operationsStore.set(op.operation_id, op);
      const response = {
        operation_id: op.operation_id,
        operation_status: op.operation_status,
        checkout_session_reference: null,
        fake_checkout_token: null,
        expires_at: null,
        confirmation_state: "unconfirmed",
        replayed: false,
        browser_authoritative: false,
      };

      if (idKey) idempotencyStore.set(idKey, response);

      return HttpResponse.json(response, { status: 201 });
    },
  ),
);

// GET handler for fetching operation status
platformBillingHandlers.push(
  http.get(
    "*/api/v1/platform-billing/checkout-operations/:operation_id",
    ({ params, request }) => {
      const scenario = request.headers.get("x-msw-scenario") || "";
      const opId = (params as Record<string, string>).operation_id as string;

      if (scenario === "403")
        return HttpResponse.json({ detail: "forbidden" }, { status: 403 });
      if (scenario === "429")
        return HttpResponse.json({ detail: "rate_limited" }, { status: 429 });
      if (scenario === "422")
        return HttpResponse.json({ detail: "invalid operation" }, { status: 422 });
      if (scenario === "500")
        return HttpResponse.json({ detail: "server" }, { status: 500 });
      if (scenario === "browser_authoritative") {
        return HttpResponse.json(
          {
            operation_id: opId,
            operation_status: "pending",
            checkout_session_reference: null,
            expires_at: null,
            error_code: null,
            browser_authoritative: true,
          },
          { status: 200 },
        );
      }

      const stored = operationsStore.get(opId);
      if (!stored) {
        // allow tests to simulate missing operation
        if (scenario === "not_found")
          return HttpResponse.json({ detail: "not found" }, { status: 404 });
        return HttpResponse.json({ detail: "not found" }, { status: 404 });
      }

      // Allow scenario to force terminal states
      if (scenario === "succeeded") {
        const s = {
          ...stored,
          operation_status: "succeeded",
        };
        operationsStore.set(opId, s);
        return HttpResponse.json(s);
      }
      if (scenario === "failed") {
        const s = {
          ...stored,
          operation_status: "failed",
          error_code: "processing_failed",
        };
        operationsStore.set(opId, s);
        return HttpResponse.json(s);
      }
      if (scenario === "in_progress") {
        const s = {
          ...stored,
          operation_status: "in_progress",
        };
        operationsStore.set(opId, s);
        return HttpResponse.json(s);
      }

      // Default: return stored state
      return HttpResponse.json(stored);
    },
  ),
);

platformBillingHandlers.push(
  http.post(
    "*/api/v1/platform-billing/fake-checkout-simulations",
    async ({ request }) => {
      const scenario = request.headers.get("x-msw-scenario") || "";
      const idKey = request.headers.get("Idempotency-Key") || "";

      if (idKey && !/^[A-Za-z0-9_-]{16,160}$/.test(idKey)) {
        return HttpResponse.json(
          { detail: "Invalid Idempotency-Key" },
          { status: 422 },
        );
      }
      if (scenario === "403")
        return HttpResponse.json({ detail: "forbidden" }, { status: 403 });
      if (scenario === "409")
        return HttpResponse.json({ detail: "conflict" }, { status: 409 });
      if (scenario === "422")
        return HttpResponse.json({ detail: "invalid" }, { status: 422 });
      if (scenario === "429")
        return HttpResponse.json({ detail: "rate_limited" }, { status: 429 });
      if (scenario === "500")
        return HttpResponse.json({ detail: "server" }, { status: 500 });

      let body: Record<string, unknown>;
      try {
        body = (await request.json()) as Record<string, unknown>;
      } catch {
        return HttpResponse.json({ detail: "invalid body" }, { status: 422 });
      }

      if (idKey && idempotencyStore.has(idKey)) {
        return HttpResponse.json(
          idempotencyStore.get(idKey) as Record<string, unknown>,
          { status: 200 },
        );
      }

      const checkoutOperationId = String(body.checkout_operation_id || "");
      const requestedOutcome = String(body.requested_outcome || "");
      if (
        !checkoutOperationId ||
        !["pending", "succeeded", "failed"].includes(requestedOutcome)
      ) {
        return HttpResponse.json({ detail: "invalid body" }, { status: 422 });
      }

      const operation = operationsStore.get(checkoutOperationId);
      if (!operation) {
        return HttpResponse.json({ detail: "not found" }, { status: 404 });
      }

      const status =
        requestedOutcome === "succeeded"
          ? "succeeded"
          : requestedOutcome === "failed"
            ? "failed"
            : "pending";
      operationsStore.set(checkoutOperationId, {
        ...operation,
        operation_status: status,
        error_code: status === "failed" ? "simulated_failure" : null,
      });

      const response = {
        simulation_operation_id: makeUuid(),
        checkout_operation_id: checkoutOperationId,
        outcome_status: "outcome_" + requestedOutcome,
        webhook_processing_status: status === "pending" ? null : "processed",
        provider_event_reference: "provider_event_secret",
        replayed: false,
        browser_authoritative: scenario === "browser_authoritative",
        subscription_activated: scenario === "subscription_activated",
      };
      simulationStore.set(response.simulation_operation_id, response);
      if (idKey) idempotencyStore.set(idKey, response);

      return HttpResponse.json(response, { status: 201 });
    },
  ),
);

platformBillingHandlers.push(
  http.get(
    "*/api/v1/platform-billing/fake-checkout-simulations/:simulation_operation_id",
    ({ params }) => {
      const simulationOperationId = (params as Record<string, string>)
        .simulation_operation_id as string;
      const stored = simulationStore.get(simulationOperationId);
      if (!stored) {
        return HttpResponse.json({ detail: "not found" }, { status: 404 });
      }
      return HttpResponse.json(stored);
    },
  ),
);
