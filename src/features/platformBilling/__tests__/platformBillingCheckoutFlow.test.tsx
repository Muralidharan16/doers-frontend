import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useCreatePlatformBillingCheckoutSession } from "../hooks/usePlatformBillingCheckoutSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// userEvent intentionally unused in this focused spec
import { server } from "@/test/server";
import { createPlatformBillingCheckoutSession } from "../api/platformBillingApi";
import { generatePlatformBillingIdempotencyKey } from "../utils/idempotency";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Platform billing checkout flow (focused)", () => {
  it("generates idempotency keys with correct format and length", () => {
    const key = generatePlatformBillingIdempotencyKey();
    expect(key.length).toBeGreaterThanOrEqual(16);
    expect(/^[A-Za-z0-9_-]+$/.test(key)).toBe(true);
  });

  it("rejects create when payload includes forbidden amount field", async () => {
    const badPayload = {
      plan_code: "DOERS-STARTER",
      billing_interval: "month",
      amount: 100,
    } as unknown as Record<string, unknown>;
    const key = generatePlatformBillingIdempotencyKey();
    await expect(
      createPlatformBillingCheckoutSession(badPayload, key),
    ).rejects.toBeDefined();
  });

  it("rejects browser_authoritative create responses at API boundary", async () => {
    // override POST to return browser_authoritative true
    server.use(
      http.post("*/api/v1/platform-billing/checkout-sessions", () => {
        const resp = {
          operation_id: "00000000-0000-4000-8000-000000000000",
          operation_status: "pending",
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: "unconfirmed",
          replayed: false,
          browser_authoritative: true,
        };
        return HttpResponse.json(resp, { status: 201 });
      }),
    );

    const key = generatePlatformBillingIdempotencyKey();
    await expect(
      createPlatformBillingCheckoutSession(
        { plan_code: "DOERS-STARTER", billing_interval: "month" },
        key,
      ),
    ).rejects.toBeDefined();
  });

  it("prevents duplicate POSTs by idempotency and in-flight guard (deterministic)", async () => {
    let postCount = 0;
    server.use(
      http.post("*/api/v1/platform-billing/checkout-sessions", () => {
        postCount += 1;
        const resp = {
          operation_id: "00000000-0000-4000-8000-000000000001",
          operation_status: "pending",
          checkout_session_reference: null,
          fake_checkout_token: null,
          expires_at: null,
          confirmation_state: "unconfirmed",
          replayed: false,
          browser_authoritative: false,
        };
        return HttpResponse.json(resp, { status: 201 });
      }),
    );

    function TestStartControls() {
      const { start } = useCreatePlatformBillingCheckoutSession();
      const handle = async () => {
        const key = generatePlatformBillingIdempotencyKey();
        // call start twice quickly to simulate double activation
        void start(
          { plan_code: "DOERS-STARTER", billing_interval: "month" },
          key,
        );
        void start(
          { plan_code: "DOERS-STARTER", billing_interval: "month" },
          key,
        );
      };
      return (
        <button onPointerDown={() => {}} onClick={handle}>
          Start checkout
        </button>
      );
    }

    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={qc}>
        <TestStartControls />
      </QueryClientProvider>,
    );
    const btn = screen.getByRole("button", { name: /start checkout/i });
    fireEvent.pointerDown(btn);
    fireEvent.click(btn);

    await waitFor(() => expect(postCount).toBe(1));
  });



  it('reuses the first active idempotency key during an in-flight attempt', async () => {
    const headers: string[] = [];
    let resolveRequest: (() => void) | undefined;
    const pending = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', async ({ request }) => {
        headers.push(request.headers.get('Idempotency-Key') ?? '');
        await pending;
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000201',
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

    function TestStartControls() {
      const { start } = useCreatePlatformBillingCheckoutSession();
      return (
        <button
          onClick={() => {
            void start({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, 'Active_Attempt_0001');
            void start({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, 'Active_Attempt_0002');
          }}
        >
          Start checkout
        </button>
      );
    }

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <TestStartControls />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /start checkout/i }));
    await waitFor(() => expect(headers).toEqual(['Active_Attempt_0001']));
    resolveRequest?.();
  });

  it('allows a new idempotency key after terminal failure is cleared by the caller', async () => {
    const headers: string[] = [];
    server.use(
      http.post('*/api/v1/platform-billing/checkout-sessions', ({ request }) => {
        headers.push(request.headers.get('Idempotency-Key') ?? '');
        return HttpResponse.json({ detail: 'temporary' }, { status: 500 });
      }),
    );

    function TestRetryControls() {
      const { start, clearKey } = useCreatePlatformBillingCheckoutSession();
      const submit = async (key: string) => {
        try {
          await start({ plan_code: 'DOERS-STARTER', billing_interval: 'month' }, key);
        } catch {
          clearKey();
        }
      };
      return (
        <>
          <button onClick={() => void submit('Terminal_Failure_0001')}>first</button>
          <button onClick={() => void submit('Terminal_Failure_0002')}>second</button>
        </>
      );
    }

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <TestRetryControls />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'first' }));
    await waitFor(() => expect(headers).toEqual(['Terminal_Failure_0001']));
    fireEvent.click(screen.getByRole('button', { name: 'second' }));
    await waitFor(() => expect(headers).toEqual(['Terminal_Failure_0001', 'Terminal_Failure_0002']));
  });

  // Note: UI double-click behavior is validated indirectly via hook and API tests.
});

export {};
