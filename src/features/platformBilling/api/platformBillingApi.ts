import { isAxiosError } from 'axios';
import { ZodError } from 'zod';
import { apiClient } from '@/shared/services/api/client';
import {
  platformBillingCheckoutOptionsSchema,
  platformBillingSummarySchema,
  type PlatformBillingCheckoutOptions,
  type PlatformBillingSummary,
} from '../schemas/platformBillingSchemas';

export type PlatformBillingReadErrorKind = 'auth' | 'denied' | 'not_found' | 'rate_limited' | 'validation' | 'temporary';

export class PlatformBillingReadError extends Error {
  readonly kind: PlatformBillingReadErrorKind;
  readonly status?: number;

  constructor(kind: PlatformBillingReadErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'PlatformBillingReadError';
    this.kind = kind;
    this.status = status;
  }
}

function toReadError(error: unknown): PlatformBillingReadError {
  if (error instanceof ZodError) {
    return new PlatformBillingReadError('validation', 'Billing information could not be safely read.');
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return new PlatformBillingReadError('auth', 'Session expired.', status);
    if (status === 403) return new PlatformBillingReadError('denied', 'Permission denied.', status);
    if (status === 404) return new PlatformBillingReadError('not_found', 'Billing information is unavailable.', status);
    if (status === 422) return new PlatformBillingReadError('validation', 'Billing information could not be safely read.', status);
    if (status === 429) return new PlatformBillingReadError('rate_limited', 'Billing information is temporarily rate limited.', status);
    return new PlatformBillingReadError('temporary', 'Billing information is temporarily unavailable.', status);
  }

  return new PlatformBillingReadError('temporary', 'Billing information is temporarily unavailable.');
}

export function shouldRetryPlatformBillingRead(failureCount: number, error: Error): boolean {
  if (failureCount >= 2) return false;
  if (error instanceof PlatformBillingReadError) {
    return error.kind === 'temporary' || error.kind === 'rate_limited';
  }
  return false;
}

export async function fetchPlatformBillingSummary(signal?: AbortSignal): Promise<PlatformBillingSummary> {
  try {
    const response = await apiClient.get<unknown>('/api/v1/platform-billing/summary', { signal });
    return platformBillingSummarySchema.parse(response.data);
  } catch (error) {
    throw toReadError(error);
  }
}

export async function fetchPlatformBillingCheckoutOptions(signal?: AbortSignal): Promise<PlatformBillingCheckoutOptions> {
  try {
    const response = await apiClient.get<unknown>('/api/v1/platform-billing/checkout-options', { signal });
    return platformBillingCheckoutOptionsSchema.parse(response.data);
  } catch (error) {
    throw toReadError(error);
  }
}
