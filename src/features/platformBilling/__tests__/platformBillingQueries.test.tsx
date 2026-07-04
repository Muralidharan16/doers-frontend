import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { usePlatformBillingCheckoutOptions } from '../hooks/usePlatformBillingCheckoutOptions';
import { usePlatformBillingSummary } from '../hooks/usePlatformBillingSummary';
import { usePlatformBillingCheckoutOperation } from '../hooks/usePlatformBillingCheckoutSession';
import { createTestQueryClient } from '@/test/renderWithProviders';
import { server } from '@/test/server';

function wrapper(queryClient = createTestQueryClient()) {
  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('Platform Billing React Query hooks', () => {
  it('uses the committed summary and checkout-options query keys', async () => {
    const queryClient = createTestQueryClient();
    const summary = renderHook(() => usePlatformBillingSummary(true), {
      wrapper: wrapper(queryClient),
    });
    const options = renderHook(() => usePlatformBillingCheckoutOptions(true), {
      wrapper: wrapper(queryClient),
    });

    await waitFor(() => expect(summary.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(options.result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(['platform-billing', 'summary'])).toBeDefined();
    expect(queryClient.getQueryData(['platform-billing', 'checkout-options'])).toBeDefined();
  });

  it('uses a fresh QueryClient cache per test utility call', () => {
    const first = createTestQueryClient();
    const second = createTestQueryClient();
    first.setQueryData(['platform-billing', 'summary'], { marker: true });
    expect(second.getQueryData(['platform-billing', 'summary'])).toBeUndefined();
  });

  it('does not configure polling', async () => {
    const queryClient = createTestQueryClient();
    const summary = renderHook(() => usePlatformBillingSummary(true), {
      wrapper: wrapper(queryClient),
    });
    const options = renderHook(() => usePlatformBillingCheckoutOptions(true), {
      wrapper: wrapper(queryClient),
    });

    await waitFor(() => expect(summary.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(options.result.current.isSuccess).toBe(true));

    expect(summary.result.current.dataUpdatedAt).toBeGreaterThan(0);
    expect(options.result.current.dataUpdatedAt).toBeGreaterThan(0);
  });

  it('cancels an in-flight query on unmount where observable', () => {
    const queryClient = createTestQueryClient();
    const hook = renderHook(() => usePlatformBillingCheckoutOptions(true), {
      wrapper: wrapper(queryClient),
    });
    hook.unmount();
    expect(
      queryClient.isFetching({ queryKey: ['platform-billing', 'checkout-options'] }),
    ).toBeGreaterThanOrEqual(0);
  });

  it('does not enable operation polling without operationId', async () => {
    const queryClient = createTestQueryClient();
    const hook = renderHook(() => usePlatformBillingCheckoutOperation(null), {
      wrapper: wrapper(queryClient),
    });
    expect(hook.result.current.fetchStatus).toBe('idle');
    expect(hook.result.current.data).toBeUndefined();
  });

  it('enables operation polling with operationId and stops on succeeded', async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/00000000-0000-4000-8000-000000000010', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000010',
          operation_status: 'succeeded',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const hook = renderHook(
      () => usePlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000010', { pollIntervalMs: 10, maxAttempts: 2 }),
      { wrapper: wrapper(queryClient) },
    );

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data?.operation_status).toBe('succeeded');
    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['platform-billing', 'summary'] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['platform-billing', 'checkout-options'] });
    });
  });

  it('stops polling and marks timeout when pending exceeds max attempts', async () => {
    const queryClient = createTestQueryClient();

    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/00000000-0000-4000-8000-000000000011', () =>
        HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000011',
          operation_status: 'pending',
          checkout_session_reference: null,
          expires_at: null,
          error_code: null,
          browser_authoritative: false,
        }),
      ),
    );

    const hook = renderHook(
      () => usePlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000011', { pollIntervalMs: 10, maxAttempts: 1 }),
      { wrapper: wrapper(queryClient) },
    );

    await waitFor(() => expect(hook.result.current.data?.operation_status).toBe('pending'));
    await waitFor(() => expect(hook.result.current.timeoutReached).toBe(true));
  });

  it('stops operation polling on failed terminal status', async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    let calls = 0;
    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/00000000-0000-4000-8000-000000000012', () => {
        calls += 1;
        return HttpResponse.json({
          operation_id: '00000000-0000-4000-8000-000000000012',
          operation_status: 'failed',
          checkout_session_reference: null,
          expires_at: null,
          error_code: 'processing_failed',
          browser_authoritative: false,
        });
      }),
    );

    const hook = renderHook(
      () => usePlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000012', { pollIntervalMs: 10, maxAttempts: 2 }),
      { wrapper: wrapper(queryClient) },
    );

    await waitFor(() => expect(hook.result.current.data?.operation_status).toBe('failed'));
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(calls).toBe(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['platform-billing', 'summary'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['platform-billing', 'checkout-options'] });
  });

  it('stops operation polling on safe action errors', async () => {
    const queryClient = createTestQueryClient();
    let calls = 0;
    server.use(
      http.get('*/api/v1/platform-billing/checkout-operations/00000000-0000-4000-8000-000000000013', () => {
        calls += 1;
        return HttpResponse.json({ detail: 'forbidden' }, { status: 403 });
      }),
    );

    const hook = renderHook(
      () => usePlatformBillingCheckoutOperation('00000000-0000-4000-8000-000000000013', { pollIntervalMs: 10, maxAttempts: 2 }),
      { wrapper: wrapper(queryClient) },
    );

    await waitFor(() => expect(hook.result.current.isError).toBe(true));
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(calls).toBe(1);
    expect(hook.result.current.timeoutReached).toBe(false);
  });

});
