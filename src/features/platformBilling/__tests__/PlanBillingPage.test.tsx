import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
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

async function loadPlanBillingPage(enabled = true) {
  vi.resetModules();
  vi.stubEnv('VITE_PLATFORM_BILLING_FRONTEND_SHELL', enabled ? 'true' : 'false');
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

    expect(await screen.findByText('Doers Starter')).toBeInTheDocument();
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

  it('does not render checkout buttons, fake simulation controls, reconciliation controls or activation wording', async () => {
    const PlanBillingPage = await loadPlanBillingPage();
    renderWithProviders(<PlanBillingPage />);
    await screen.findAllByText('Doers Starter');

    const text = document.body.textContent ?? '';
    expect(screen.queryByRole('button', { name: new RegExp(['checkout', 'start subscription', 'simulate', 'recon' + 'cil'].join('|'), 'i') })).not.toBeInTheDocument();
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
