import { isAxiosError } from "axios";
import { ZodError } from "zod";
import { apiClient } from "@/shared/services/api/client";
import {
  platformBillingCheckoutOptionsSchema,
  platformBillingSummarySchema,
  createCheckoutSessionResponseSchema,
  getCheckoutOperationResponseSchema,
  createFakeCheckoutSimulationRequestSchema,
  fakeCheckoutSimulationResponseSchema,
  type PlatformBillingCheckoutOptions,
  type PlatformBillingSummary,
  type CreateCheckoutSessionRequest,
  type CreateCheckoutSessionResponse,
  type GetCheckoutOperationResponse,
  type CreateFakeCheckoutSimulationRequest,
  type FakeCheckoutSimulationResponse,
} from "../schemas/platformBillingSchemas";

export type PlatformBillingReadErrorKind =
  | "auth"
  | "denied"
  | "not_found"
  | "rate_limited"
  | "validation"
  | "temporary";

export class PlatformBillingReadError extends Error {
  readonly kind: PlatformBillingReadErrorKind;
  readonly status?: number;

  constructor(
    kind: PlatformBillingReadErrorKind,
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "PlatformBillingReadError";
    this.kind = kind;
    this.status = status;
  }
}

function toReadError(error: unknown): PlatformBillingReadError {
  if (error instanceof ZodError) {
    return new PlatformBillingReadError(
      "validation",
      "Billing information could not be safely read.",
    );
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401)
      return new PlatformBillingReadError("auth", "Session expired.", status);
    if (status === 403)
      return new PlatformBillingReadError(
        "denied",
        "Permission denied.",
        status,
      );
    if (status === 404)
      return new PlatformBillingReadError(
        "not_found",
        "Billing information is unavailable.",
        status,
      );
    if (status === 422)
      return new PlatformBillingReadError(
        "validation",
        "Billing information could not be safely read.",
        status,
      );
    if (status === 429)
      return new PlatformBillingReadError(
        "rate_limited",
        "Billing information is temporarily rate limited.",
        status,
      );
    return new PlatformBillingReadError(
      "temporary",
      "Billing information is temporarily unavailable.",
      status,
    );
  }

  return new PlatformBillingReadError(
    "temporary",
    "Billing information is temporarily unavailable.",
  );
}

export function shouldRetryPlatformBillingRead(
  failureCount: number,
  error: Error,
): boolean {
  if (failureCount >= 2) return false;
  if (error instanceof PlatformBillingReadError) {
    return error.kind === "temporary" || error.kind === "rate_limited";
  }
  return false;
}

export async function fetchPlatformBillingSummary(
  signal?: AbortSignal,
): Promise<PlatformBillingSummary> {
  try {
    const response = await apiClient.get<unknown>(
      "/api/v1/platform-billing/summary",
      { signal },
    );
    return platformBillingSummarySchema.parse(response.data);
  } catch (error) {
    throw toReadError(error);
  }
}

export async function fetchPlatformBillingCheckoutOptions(
  signal?: AbortSignal,
): Promise<PlatformBillingCheckoutOptions> {
  try {
    const response = await apiClient.get<unknown>(
      "/api/v1/platform-billing/checkout-options",
      { signal },
    );
    return platformBillingCheckoutOptionsSchema.parse(response.data);
  } catch (error) {
    throw toReadError(error);
  }
}

// Action errors for checkout creation and operation reads
export type PlatformBillingActionErrorKind =
  | "auth"
  | "denied"
  | "not_found"
  | "conflict"
  | "validation"
  | "temporary"
  | "rate_limited";

export class PlatformBillingActionError extends Error {
  readonly kind: PlatformBillingActionErrorKind;
  readonly status?: number;

  constructor(
    kind: PlatformBillingActionErrorKind,
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "PlatformBillingActionError";
    this.kind = kind;
    this.status = status;
  }
}

function toActionError(error: unknown): PlatformBillingActionError {
  if (error instanceof PlatformBillingActionError) return error;
  if (error instanceof ZodError) {
    return new PlatformBillingActionError(
      "validation",
      "Checkout response could not be safely read.",
    );
  }
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401)
      return new PlatformBillingActionError("auth", "Session expired.", status);
    if (status === 403)
      return new PlatformBillingActionError(
        "denied",
        "Permission denied.",
        status,
      );
    if (status === 404)
      return new PlatformBillingActionError(
        "not_found",
        "Resource not found.",
        status,
      );
    if (status === 409)
      return new PlatformBillingActionError(
        "conflict",
        "Idempotency or conflict error.",
        status,
      );
    if (status === 422)
      return new PlatformBillingActionError(
        "validation",
        "Checkout input invalid.",
        status,
      );
    if (status === 429)
      return new PlatformBillingActionError(
        "rate_limited",
        "Rate limited.",
        status,
      );
    return new PlatformBillingActionError(
      "temporary",
      "Temporary backend error.",
      status,
    );
  }
  return new PlatformBillingActionError(
    "temporary",
    "Temporary backend error.",
  );
}

export async function createPlatformBillingCheckoutSession(
  payload: CreateCheckoutSessionRequest,
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<CreateCheckoutSessionResponse> {
  try {
    const response = await apiClient.post<unknown>(
      "/api/v1/platform-billing/checkout-sessions",
      payload,
      {
        headers: { "Idempotency-Key": idempotencyKey },
        signal,
      },
    );
    const parsed = createCheckoutSessionResponseSchema.parse(response.data);
    if (parsed.browser_authoritative) {
      throw new PlatformBillingActionError(
        "validation",
        "Checkout response could not be safely read.",
      );
    }
    return parsed;
  } catch (error) {
    throw toActionError(error);
  }
}

export async function fetchPlatformBillingCheckoutOperation(
  operationId: string,
  signal?: AbortSignal,
): Promise<GetCheckoutOperationResponse> {
  try {
    const response = await apiClient.get<unknown>(
      `/api/v1/platform-billing/checkout-operations/${operationId}`,
      { signal },
    );
    const parsed = getCheckoutOperationResponseSchema.parse(response.data);
    if (parsed.browser_authoritative) {
      throw new PlatformBillingActionError(
        "validation",
        "Checkout response could not be safely read.",
      );
    }
    return parsed;
  } catch (error) {
    throw toActionError(error);
  }
}

export async function createFakeCheckoutSimulation(
  payload: CreateFakeCheckoutSimulationRequest,
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<FakeCheckoutSimulationResponse> {
  try {
    const body = createFakeCheckoutSimulationRequestSchema.parse(payload);
    const response = await apiClient.post<unknown>(
      "/api/v1/platform-billing/fake-checkout-simulations",
      body,
      {
        headers: { "Idempotency-Key": idempotencyKey },
        signal,
      },
    );
    const parsed = fakeCheckoutSimulationResponseSchema.parse(response.data);
    if (parsed.browser_authoritative || parsed.subscription_activated) {
      throw new PlatformBillingActionError(
        "validation",
        "Checkout response could not be safely read.",
      );
    }
    return parsed;
  } catch (error) {
    throw toActionError(error);
  }
}

export async function fetchFakeCheckoutSimulation(
  simulationOperationId: string,
  signal?: AbortSignal,
): Promise<FakeCheckoutSimulationResponse> {
  try {
    const response = await apiClient.get<unknown>(
      `/api/v1/platform-billing/fake-checkout-simulations/${simulationOperationId}`,
      { signal },
    );
    const parsed = fakeCheckoutSimulationResponseSchema.parse(response.data);
    if (parsed.browser_authoritative || parsed.subscription_activated) {
      throw new PlatformBillingActionError(
        "validation",
        "Checkout response could not be safely read.",
      );
    }
    return parsed;
  } catch (error) {
    throw toActionError(error);
  }
}
