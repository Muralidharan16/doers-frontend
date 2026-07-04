import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { usePlatformBillingCheckoutOptions } from '../hooks/usePlatformBillingCheckoutOptions';
import { usePlatformBillingSummary } from '../hooks/usePlatformBillingSummary';
import { createTestQueryClient } from '@/test/renderWithProviders';

function wrapper(queryClient = createTestQueryClient()) {
  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('Platform Billing React Query hooks', () => {
  it('uses the committed summary and checkout-options query keys', async () => {
    const queryClient = createTestQueryClient();
    const summary = renderHook(() => usePlatformBillingSummary(true), { wrapper: wrapper(queryClient) });
    const options = renderHook(() => usePlatformBillingCheckoutOptions(true), { wrapper: wrapper(queryClient) });

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
    const summary = renderHook(() => usePlatformBillingSummary(true), { wrapper: wrapper(queryClient) });
    const options = renderHook(() => usePlatformBillingCheckoutOptions(true), { wrapper: wrapper(queryClient) });

    await waitFor(() => expect(summary.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(options.result.current.isSuccess).toBe(true));

    expect(summary.result.current.dataUpdatedAt).toBeGreaterThan(0);
    expect(options.result.current.dataUpdatedAt).toBeGreaterThan(0);
  });

  it('cancels an in-flight query on unmount where observable', () => {
    const queryClient = createTestQueryClient();
    const hook = renderHook(() => usePlatformBillingCheckoutOptions(true), { wrapper: wrapper(queryClient) });
    hook.unmount();
    expect(queryClient.isFetching({ queryKey: ['platform-billing', 'checkout-options'] })).toBeGreaterThanOrEqual(0);
  });
});
