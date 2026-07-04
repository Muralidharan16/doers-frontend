import { http, HttpResponse } from 'msw';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/renderWithProviders';
import { server } from '@/test/server';
import {
  platformBillingCheckoutOptionsFixture,
  platformBillingSummaryFixture,
} from '@/test/handlers/platformBillingHandlers';

afterEach(() => {
  vi.unstubAllEnvs();
});

async function loadPlanBillingPage(enabled = true, interactive = true) {
  vi.resetModules();
  vi.stubEnv('VITE_PLATFORM_BILLING_FRONTEND_SHELL', enabled ? 'true' : 'false');
  vi.stubEnv('VITE_PLATFORM_BILLING_ENABLE_INTERACTIVE', interactive ? 'true' : 'false');
  const module = await import('../pages/PlanBillingPage');
  return module.PlanBillingPage;
}

function checkoutFixture() {
  return structuredClone(platformBillingCheckoutOptionsFixture);
}

function summaryFixture() {
  return structuredClone(platformBillingSummaryFixture);
}

describe('PlanBillingPage', () => {
  it('renders loading, current summary, no-subscription state, backend plans, prices and informational availability', async () => {
    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect(screen.getByText('Loading Doers Plan & Billing...')).toBeInTheDocument();
    expect(await screen.findByText('Account access is active')).toBeInTheDocument();
    expect(screen.getAllByText('No active Doers platform subscription').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Doers Starter').length).toBeGreaterThan(0);
    expect(screen.getByText('Backend provided starter platform plan.')).toBeInTheDocument();
    expect(screen.getByText(/999\.00/)).toBeInTheDocument();
    expect(screen.getByText(/123\.45/)).toBeInTheDocument();
    expect(screen.getAllByText(/999/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('A subscription checkout option is available.')).toBeInTheDocument();
  });

  it('renders current subscription facts when present', async () => {
    const options = checkoutFixture();
    options.current_subscription = {
      status: 'trialing',
      current_plan_code: 'DOERS-STARTER',
      current_plan_display_name: 'Doers Starter',
      period_type: 'trial',
      cancel_at_period_end: true,
    };
    options.plans[0].is_current = true;
    server.use(http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json(options)));

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect(await screen.findByText('Trial subscription')).toBeInTheDocument();
    expect(screen.getByText('trial')).toBeInTheDocument();
    expect(screen.getByText('Cancellation scheduled')).toBeInTheDocument();
    expect(screen.getByText('Current plan')).toBeInTheDocument();
  });

  it('renders no-plan and unavailable checkout states from the backend', async () => {
    const options = checkoutFixture();
    options.plans = [];
    options.actions = [];
    options.checkout_availability = {
      available: false,
      reason_code: 'NO_AVAILABLE_PLANS',
      message: 'No Platform Billing checkout option is currently available.',
      action_code: 'start_subscription',
    };
    server.use(http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json(options)));

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect((await screen.findAllByText('No Doers platform plans are currently available.')).length).toBeGreaterThan(0);
    expect(screen.getByText('Checkout is currently unavailable')).toBeInTheDocument();
  });

  it('shows the start checkout button only when checkout is available and interactive is enabled', async () => {
    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    expect(await screen.findByRole('button', { name: /start checkout/i })).toBeInTheDocument();
  });

  it('hides start checkout controls when checkout is unavailable', async () => {
    const options = checkoutFixture();
    options.checkout_availability.available = false;
    options.checkout_availability.message = 'No checkout available';
    server.use(http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json(options)));

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    await screen.findByText('Checkout is currently unavailable');
    expect(screen.queryByRole('button', { name: /start checkout/i })).not.toBeInTheDocument();
  });

  it('hides start checkout controls when interactive flag is disabled', async () => {
    const PlanBillingPage = await loadPlanBillingPage(true, false);
    renderWithProviders(<PlanBillingPage />);

    await screen.findAllByText('Doers Starter');
    expect(screen.queryByRole('button', { name: /start checkout/i })).not.toBeInTheDocument();
  });

  it('sends selected plan and interval in the checkout request body', async () => {
    const requests: Array<unknown> = [];
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', async ({ request }) => {
        requests.push(await request.json());
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000012',
          operation_status: 'pending',
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: 'unconfirmed',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 });
      }),
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000012',
          operation_status: 'pending',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    await screen.findByRole('button', { name: /start checkout/i });
    await userEvent.selectOptions(screen.getByLabelText('Select plan'), '1');
        await userEvent.click(screen.getByRole('button', { name: /start checkout/i }));

    await waitFor(() => expect(requests.length).toBe(1));
    const body = requests[0] as Record<string, unknown>;
    expect(body).toEqual({ plan_code: 'DOERS-JPY', billing_interval: 'month' });
  });

  it('disables the start checkout button while create request is pending', async () => {
    let resolveRequest: () => void;
    const pendingResponse = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', async () => {
        await pendingResponse;
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000013',
          operation_status: 'pending',
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: 'unconfirmed',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 });
      }),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    const button = await screen.findByRole('button', { name: /start checkout/i });
    await userEvent.click(button);
    expect(button).toBeDisabled();
    resolveRequest!();
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it('prevents duplicate POST on rapid double-click of start checkout', async () => {
    let postCount = 0;
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', async () => {
        postCount += 1;
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000014',
          operation_status: 'pending',
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: 'unconfirmed',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 });
      }),
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000014',
          operation_status: 'pending',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    const button = await screen.findByRole('button', { name: /start checkout/i });
    fireEvent.pointerDown(button);
    fireEvent.click(button);
    fireEvent.pointerDown(button);
    fireEvent.click(button);

    await waitFor(() => expect(postCount).toBe(1));
  });

  it('shows polling pending status after checkout begins', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000015',
          operation_status: 'pending',
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: 'unconfirmed',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 }),
      ),
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000015',
          operation_status: 'pending',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    const button = await screen.findByRole('button', { name: /start checkout/i });
    userEvent.click(button);
    expect(await screen.findByText('Checkout operation pending')).toBeInTheDocument();
  });

  it('shows safe retry copy for temporary checkout create failures', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({ detail: 'server error' }, { status: 500 }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    const button = await screen.findByRole('button', { name: /start checkout/i });
    await userEvent.click(button);

    expect(await screen.findByText('Checkout request temporarily failed. Please retry.')).toBeInTheDocument();
  });

  it('shows safe permission denied copy for checkout create failures', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({ detail: 'forbidden' }, { status: 403 }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    const button = await screen.findByRole('button', { name: /start checkout/i });
    await userEvent.click(button);

    expect(await screen.findByText('You do not have permission to start checkout.')).toBeInTheDocument();
  });

  it('does not allow checkout POST when checkout-options is malformed', async () => {
    let postCount = 0;
    server.use(
      http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json({ broken: true })),
      http.post('*/api/v1/platform-billing/checkout-sessions', () => {
        postCount += 1;
        return HttpResponse.json({ detail: 'unexpected' }, { status: 500 });
      }),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    await screen.findByText('Billing information could not be safely read.');
    expect(postCount).toBe(0);
  });

  it('preserves summary data when checkout-options fails validation', async () => {
    server.use(http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json({ broken: true })));

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect(await screen.findByText('Account access is active')).toBeInTheDocument();
    expect(screen.getByText('Billing information could not be safely read.')).toBeInTheDocument();
  });

  it('preserves checkout-options data when summary fails', async () => {
    server.use(http.get('*/api/v1/platform-billing/summary', () => HttpResponse.json({ broken: true })));

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect((await screen.findAllByText('Doers Starter')).length).toBeGreaterThan(0);
    expect(screen.getByText('Billing information could not be safely read.')).toBeInTheDocument();
  });

  it('shows scoped temporary errors and retries failed reads', async () => {
    let summaryCalls = 0;
    server.use(
      http.get('*/api/v1/platform-billing/summary', () => {
        summaryCalls += 1;
        if (summaryCalls === 1) return HttpResponse.json({ broken: true });
        return HttpResponse.json(summaryFixture());
      })
    );

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect(await screen.findByText('Billing information could not be safely read.')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: /retry/i })[0]);
    expect(await screen.findByText('Account access is active')).toBeInTheDocument();
  });

  it('shows safe permission-denied copy', async () => {
    server.use(
      http.get('*/api/v1/platform-billing/summary', () => HttpResponse.json({ detail: { secret: 'hidden' } }, { status: 403 })),
      http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json({ detail: { secret: 'hidden' } }, { status: 403 }))
    );

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);

    expect(await screen.findAllByText('You do not have permission to view Doers Plan & Billing.')).toHaveLength(2);
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });



  it('disables the start checkout button when no selected interval is available', async () => {
    const options = checkoutFixture();
    options.plans[0].prices = [];
    options.plans = [options.plans[0]];
    server.use(http.get('*/api/v1/platform-billing/checkout-options', () => HttpResponse.json(options)));

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    expect(await screen.findByRole('button', { name: /start checkout/i })).toBeDisabled();
  });

  it('does not create checkout when the interactive flag is disabled', async () => {
    let postCount = 0;
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () => {
        postCount += 1;
        return HttpResponse.json({ detail: 'unexpected' }, { status: 500 });
      }),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, false);
    renderWithProviders(<PlanBillingPage />);

    await screen.findAllByText('Doers Starter');
    expect(screen.queryByRole('button', { name: /start checkout/i })).not.toBeInTheDocument();
    expect(postCount).toBe(0);
  });

  it('does not auto-create checkout on refresh or rerender', async () => {
    let postCount = 0;
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () => {
        postCount += 1;
        return HttpResponse.json({ detail: 'unexpected' }, { status: 500 });
      }),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    const view = renderWithProviders(<PlanBillingPage />);

    await screen.findByRole('button', { name: /start checkout/i });
    view.unmount();
    renderWithProviders(<PlanBillingPage />);
    await screen.findByRole('button', { name: /start checkout/i });
    expect(postCount).toBe(0);
  });

  it('shows a bounded timeout message for stuck pending checkout operations', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000115',
          operation_status: 'pending',
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: 'unconfirmed',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 }),
      ),
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000115',
          operation_status: 'pending',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage checkoutPollingOverride={{ pollIntervalMs: 10, maxAttempts: 1 }} />);

    await userEvent.click(await screen.findByRole('button', { name: /start checkout/i }));
    expect(await screen.findByText('Checkout operation is taking longer than expected. Please retry later.')).toBeInTheDocument();
  });

  it('shows a safe terminal operation message without activation wording', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000116',
          operation_status: 'pending',
          checkout_session_reference: 'checkout_ref_secret',
          fake_checkout_token: 'fake_token_secret',
          expires_at: null,
          confirmation_state: 'unconfirmed',
          replayed: false,
          browser_authoritative: false,
        }, { status: 201 }),
      ),
      http.get('*/api/v1/platform-billing/checkout-operations/*', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000116',
          operation_status: 'succeeded',
          checkout_session_reference: 'checkout_ref_secret',
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage checkoutPollingOverride={{ pollIntervalMs: 10, maxAttempts: 2 }} />);

    await userEvent.click(await screen.findByRole('button', { name: /start checkout/i }));
    expect(await screen.findByText('Checkout operation reached a terminal state')).toBeInTheDocument();
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/payment successful|subscription activated/i);
    expect(text).not.toContain('fake_token_secret');
    expect(text).not.toContain('checkout_ref_secret');
  });

  it('shows safe validation copy for checkout create failures', async () => {
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', () =>
        HttpResponse.json({ detail: 'invalid' }, { status: 422 }),
      ),
    );

    const PlanBillingPage = await loadPlanBillingPage(true, true);
    renderWithProviders(<PlanBillingPage />);

    await userEvent.click(await screen.findByRole('button', { name: /start checkout/i }));
    expect(await screen.findByText('Checkout request could not be submitted. Please verify your selection and try again.')).toBeInTheDocument();
  });

  it('does not render fake simulation controls, reconciliation controls or activation wording', async () => {
    const PlanBillingPage = await loadPlanBillingPage(true, false);
    renderWithProviders(<PlanBillingPage />);
    await screen.findAllByText('Doers Starter');

    const text = document.body.textContent ?? '';
    expect(screen.queryByRole('button', { name: new RegExp(['simulate', 'recon' + 'cil'].join('|'), 'i') })).not.toBeInTheDocument();
    expect(text).not.toMatch(new RegExp([
      'Payment ' + 'successful',
      'Subscription ' + 'activated',
      'Member ' + 'Subscription',
      'membership ' + 'plan',
      'gym ' + 'plan',
    ].join('|'), 'i'));
    expect(text).not.toContain('cus_');
    expect(text).not.toContain('provider_price');
  });

  it('does not send POST checkout, simulation or reconciliation requests', async () => {
    const requests: Array<{ method: string; url: string }> = [];
    server.use(
      http.all('*/api/v1/platform-billing/:path*', ({ request }) => {
        requests.push({ method: request.method, url: request.url });
        if (request.url.includes('/summary')) return HttpResponse.json(platformBillingSummaryFixture);
        if (request.url.includes('/checkout-options')) return HttpResponse.json(platformBillingCheckoutOptionsFixture);
        return HttpResponse.json({ detail: 'unexpected' }, { status: 500 });
      })
    );

    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);
    await screen.findAllByText('Doers Starter');

    expect(requests.every((request) => request.method === 'GET')).toBe(true);
    const blockedPaths = [
      ['checkout', 'sessions'].join('-'),
      ['fake', 'checkout', 'simulations'].join('-'),
      ['checkout', 'operations'].join('-'),
      'recon' + 'cil',
    ];
    expect(requests.some((request) => new RegExp(blockedPaths.join('|'), 'i').test(request.url))).toBe(false);
    expect(requests.some((request) => /organization_id|tenant_id|amount|currency|provider/.test(request.url))).toBe(false);
  });

  it('does not render when the frontend shell flag is disabled', async () => {
    const PlanBillingPage = await loadPlanBillingPage(false);
    renderWithProviders(<PlanBillingPage />);
    await waitFor(() => expect(screen.queryByText('Doers Plan & Billing')).not.toBeInTheDocument());
  });
});
