import { useQuery } from '@tanstack/react-query';
import { fetchPlatformBillingSummary, shouldRetryPlatformBillingRead } from '../api/platformBillingApi';

export function usePlatformBillingSummary(enabled: boolean) {
  return useQuery({
    queryKey: ['platform-billing', 'summary'],
    queryFn: ({ signal }) => fetchPlatformBillingSummary(signal),
    enabled,
    retry: shouldRetryPlatformBillingRead,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
