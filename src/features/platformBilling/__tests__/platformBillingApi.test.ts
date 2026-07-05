import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import {
  createFakeCheckoutSimulation,
  createPlatformBillingCheckoutSession,
  fetchFakeCheckoutSimulation,
  fetchPlatformBillingCheckoutOptions,
  fetchPlatformBillingCheckoutOperation,
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
    expect(
      shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('temporary', 'temporary')),
    ).toBe(true);
    expect(
      shouldRetryPlatformBillingRead(1, new PlatformBillingReadError('rate_limited', 'rate limited')),
    ).toBe(true);
    expect(
      shouldRetryPlatformBillingRead(2, new PlatformBillingReadError('temporary', 'temporary')),
    ).toBe(false);
    expect(
      shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('auth', 'auth')),
    ).toBe(false);
    expect(
      shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('denied', 'denied')),
    ).toBe(false);
    expect(
      shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('not_found', 'not found')),
    ).toBe(false);
    expect(
      shouldRetryPlatformBillingRead(0, new PlatformBillingReadError('validation', 'validation')),
    ).toBe(false);
  });



  it('posts checkout creation to the backend endpoint with idempotency header and only allowed body fields', async () => {
    const seen: { headers?: Headers; body?: Record<string, unknown>; method?: string; url?: string } = {};
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', async ({ request }) => {
        seen.headers = request.headers;
        seen.method = request.method;
        seen.url = request.url;
        seen.body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000101',
          operation_status: 'pending',
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: 'not_started',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 });
      }),
    );

    await createPlatformBillingCheckoutSession(
      { plan_code: 'DOERS-STARTER', billing_interval: 'month' },
      'Checkout_Key-1234',
    );

    expect(seen.method).toBe('POST');
    expect(seen.url).toContain('/api/v1/platform-billing/checkout-sessions');
    const idempotencyKey = seen.headers?.get('Idempotency-Key') ?? '';
    expect(idempotencyKey.length).toBeGreaterThanOrEqual(16);
    expect(idempotencyKey.length).toBeLessThanOrEqual(160);
    expect(idempotencyKey).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(seen.body).toEqual({ plan_code: 'DOERS-STARTER', billing_interval: 'month' });
    expect(seen.body).not.toHaveProperty('amount');
    expect(seen.body).not.toHaveProperty('currency');
    expect(seen.body).not.toHaveProperty('tenant_id');
    expect(seen.body).not.toHaveProperty('organization_id');
    expect(JSON.stringify(seen.body)).not.toMatch(/provider/i);
  });

  it('gets checkout operation status from the backend operation endpoint', async () => {
    let seenUrl = '';
    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/00000000-0000-4000-8000-000000000102', ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000102',
          operation_status: 'pending',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        });
      }),
    );

    const operation = await fetchPlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000102');

    expect(seenUrl).toContain('/api/v1/platform-billing/checkout-operations/00000000-0000-4000-8000-000000000102');
    expect(operation.operation_status).toBe('pending');
  });

  it('maps create checkout HTTP errors to safe action error kinds', async () => {
    await Promise.all(
      [
        [403, 'denied'],
        [409, 'conflict'],
        [422, 'validation'],
        [429, 'rate_limited'],
        [500, 'temporary'],
      ] as const,
    ).then(async (cases) => {
      for (const [status, kind] of cases) {
        server.use(
          http.post('*/api/v1/platform-billing/checkout-sessions', () =>
            HttpResponse.json({ detail: { secret: 'raw backend payload' } }, { status }),
          ),
        );
        await expect(
          createPlatformBillingCheckoutSession({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, 'A'.repeat(16)),
        ).rejects.toMatchObject({ kind, status });
      }
    });
  });

  it('rejects browser_authoritative create responses at API boundary', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json(
          {
            operation_id: '00000000-0000-4000-8000-000000000000',
            operation_status: 'pending',
            checkout_session_reference: null,
            fake_checkout_token: null,
            expires_at: null,
            confirmation_state: 'unconfirmed',
            replayed: false,
            browser_authoritative: true,
          },
          { status: 201 },
        ),
      ),
    );

    await expect(
      createPlatformBillingCheckoutSession({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, 'A'.repeat(16)),
    ).rejects.toMatchObject({ kind: 'validation' });
  });

  it('rejects malformed create responses at API boundary', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({ bad: 'response' }, { status: 201 }),
      ),
    );

    await expect(
      createPlatformBillingCheckoutSession({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, 'A'.repeat(16)),
    ).rejects.toMatchObject({ kind: 'validation' });
  });

  it('maps operation GET errors to safe action error kinds', async () => {
    await Promise.all(
      [
        ['403', 'denied'],
        ['not_found', 'not_found'],
        ['422', 'validation'],
        ['429', 'rate_limited'],
        ['500', 'temporary'],
      ] as const,
    ).then(async (cases) => {
      for (const [scenario, kind] of cases) {
        server.use(
          http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
            HttpResponse.json({ detail: 'error' }, { status: Number(scenario) || 404 }),
          ),
        );
        await expect(
          fetchPlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000001'),
        ).rejects.toMatchObject({ kind });
      }
    });
  });

  it('rejects browser_authoritative operation GET responses at API boundary', async () => {
    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json(
          {
            operation_id: '00000000-0000-4000-8000-000000000001',
            operation_status: 'pending',
            checkout_session_reference: null,
            expires_at: null,
            error_code: null,
            browser_authoritative: true,
          },
          { status: 200 },
        ),
      ),
    );
    await expect(
      fetchPlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000001'),
    ).rejects.toMatchObject({ kind: 'validation' });
  });

  it('rejects malformed operation responses at API boundary', async () => {
    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json({ bad: 'response' }, { status: 200 }),
      ),
    );

    await expect(
      fetchPlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000103'),
    ).rejects.toMatchObject({ kind: 'validation' });
  });


  it('posts fake checkout simulation with idempotency and only operation/outcome fields', async () => {
    const seen: { headers?: Headers; body?: Record<string, unknown>; url?: string } = {};
    server.use(
      http.post('*/api/v1/platform-billing/fake-checkout-simulations', async ({ request }) => {
        seen.headers = request.headers;
        seen.url = request.url;
        seen.body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          simulation_operation_id: '00000000-0000-4000-8000-000000000201',
          checkout_operation_id: '00000000-0000-4000-8000-000000000101',
          outcome_status: 'outcome_succeeded',
          webhook_processing_status: 'processed',
          provider_event_reference: 'provider_event_secret',
          replayed: false,
          browser_authoritative: false,
          subscription_activated: false,
        }, { status: 201 });
      }),
    );

    await createFakeCheckoutSimulation(
      {
        checkout_operation_id: '00000000-0000-4000-8000-000000000101',
        requested_outcome: 'succeeded',
      },
      'Simulation_Key-1234',
    );

    expect(seen.url).toContain('/api/v1/platform-billing/fake-checkout-simulations');
    expect(seen.headers?.get('Idempotency-Key')).toBe('Simulation_Key-1234');
    expect(seen.body).toEqual({
      checkout_operation_id: '00000000-0000-4000-8000-000000000101',
      requested_outcome: 'succeeded',
    });
    expect(seen.body).not.toHaveProperty('amount');
    expect(seen.body).not.toHaveProperty('currency');
    expect(seen.body).not.toHaveProperty('tenant_id');
    expect(JSON.stringify(seen.body)).not.toMatch(/provider/i);
  });

  it('rejects browser-authoritative or activating fake simulation responses', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/fake-checkout-simulations', () =>
        HttpResponse.json({
          simulation_operation_id: '00000000-0000-4000-8000-000000000202',
          checkout_operation_id: '00000000-0000-4000-8000-000000000101',
          outcome_status: 'outcome_succeeded',
          webhook_processing_status: 'processed',
          provider_event_reference: 'provider_event_secret',
          replayed: false,
          browser_authoritative: true,
          subscription_activated: false,
        }, { status: 201 }),
      ),
    );

    await expect(
      createFakeCheckoutSimulation({ checkout_operation_id: '00000000-0000-4000-8000-000000000101', requested_outcome: 'succeeded' }, 'A'.repeat(16)),
    ).rejects.toMatchObject({ kind: 'validation' });

    server.use(
      http.post('*/api/v1/platform-billing/fake-checkout-simulations', () =>
        HttpResponse.json({
          simulation_operation_id: '00000000-0000-4000-8000-000000000203',
          checkout_operation_id: '00000000-0000-4000-8000-000000000101',
          outcome_status: 'outcome_succeeded',
          webhook_processing_status: 'processed',
          provider_event_reference: 'provider_event_secret',
          replayed: false,
          browser_authoritative: false,
          subscription_activated: true,
        }, { status: 201 }),
      ),
    );

    await expect(
      createFakeCheckoutSimulation({ checkout_operation_id: '00000000-0000-4000-8000-000000000101', requested_outcome: 'succeeded' }, 'B'.repeat(16)),
    ).rejects.toMatchObject({ kind: 'validation' });
  });

  it('fetches fake simulation status through the read endpoint without provider selectors', async () => {
    let seenUrl = '';
    server.use(
      http.get('*/api/v1/platform-billing/fake-checkout-simulations/00000000-0000-4000-8000-000000000204', ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json({
          simulation_operation_id: '00000000-0000-4000-8000-000000000204',
          checkout_operation_id: '00000000-0000-4000-8000-000000000101',
          outcome_status: 'outcome_pending',
          webhook_processing_status: null,
          provider_event_reference: 'provider_event_secret',
          replayed: false,
          browser_authoritative: false,
          subscription_activated: false,
        });
      }),
    );

    const response = await fetchFakeCheckoutSimulation('00000000-0000-4000-8000-000000000204');

    expect(response.outcome_status).toBe('outcome_pending');
    expect(seenUrl).toContain('/api/v1/platform-billing/fake-checkout-simulations/00000000-0000-4000-8000-000000000204');
    expect(seenUrl).not.toMatch(/organization_id|tenant_id|amount|currency|provider/);
  });

  it('does not expose raw backend payload on create action errors', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({ detail: { secret: 'raw backend payload' } }, { status: 500 }),
      ),
    );
    await expect(createPlatformBillingCheckoutSession({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, 'A'.repeat(16))).rejects.toMatchObject({ kind: 'temporary' });
  });
});
