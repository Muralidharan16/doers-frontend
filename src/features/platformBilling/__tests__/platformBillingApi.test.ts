import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import {
  fetchPlatformBillingCheckoutOptions,
  fetchPlatformBillingSummary,
  PlatformBillingReadError,
  shouldRetryPlatformBillingRead,
} from '../api/platformBillingApi';
import { server } from '@/test/server';
import {
  platformBillingCheckoutOptionsFixture,
  platformBillingSummaryFixture,
} from '@/test/handlers/platformBillingHandlers';

describe('Platform Billing API reads', () => {
  it('uses GET for summary and checkout-options without browser tenant or financial selectors', async () => {
    const requests: Array<{ method: string; url: string }> = [];
    server.use(
      http.get('*/api/v1/platform-billing/summary', ({ request }) => {
        requests.push({ method: request.method, url: request.url });
        return HttpResponse.json(platformBillingSummaryFixture);
      }),
      http.get('*/api/v1/platform-billing/checkout-options', ({ request }) => {
        requests.push({ method: request.method, url: request.url });
        return HttpResponse.json(platformBillingCheckoutOptionsFixture);
      })
    );

    await fetchPlatformBillingSummary();
    await fetchPlatformBillingCheckoutOptions();

    expect(requests.map((request) => request.method)).toEqual(['GET', 'GET']);
    expect(requests.some((request) => /organization_id|tenant_id|amount|currency|provider/.test(request.url))).toBe(false);
  });

  it('accepts AbortSignal and parses valid responses', async () => {
    const controller = new AbortController();
    const summary = await fetchPlatformBillingSummary(controller.signal);
    const options = await fetchPlatformBillingCheckoutOptions(controller.signal);

    expect(summary.organization_id).toBe(platformBillingSummaryFixture.organization_id);
    expect(options.plans[0].display_name).toBe('Doers Starter');
  });

  it('maps malformed responses to safe validation errors', async () => {
    server.use(http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json({ provider_secret: 'hidden' })));

    await expect(fetchPlatformBillingCheckoutOptions()).rejects.toMatchObject({
      kind: 'validation',
      message: 'Billing information could not be safely read.',
    });
  });

  it.each([
    [403, 'denied'],
    [404, 'not_found'],
    [429, 'rate_limited'],
    [500, 'temporary'],
  ] as const)('maps HTTP %s to %s without exposing raw backend payloads', async (status, kind) => {
    server.use(
      http.get('*/api/v1/platform-billing/summary', () => HttpResponse.json({ detail: { secret: 'raw backend payload' } }, { status }))
    );

    await expect(fetchPlatformBillingSummary()).rejects.toMatchObject({ kind, status });
    await fetchPlatformBillingSummary().catch((error: unknown) => {
      expect(error).toBeInstanceOf(PlatformBillingReadError);
      expect(String((error as Error).message)).not.toContain('raw backend payload');
    });
  });

  it('bounds retries to temporary and rate-limited read failures', () => {
    expect(shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('temporary', 'temporary'))).toBe(true);
    expect(shouldRetryPlatformBillingRead(1, new PlatformBillingReadError('rate_limited', 'rate limited'))).toBe(true);
    expect(shouldRetryPlatformBillingRead(2, new PlatformBillingReadError('temporary', 'temporary'))).toBe(false);
    expect(shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('auth', 'auth'))).toBe(false);
    expect(shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('denied', 'denied'))).toBe(false);
    expect(shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('not_found', 'not found'))).toBe(false);
    expect(shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('validation', 'validation'))).toBe(false);
  });
});
