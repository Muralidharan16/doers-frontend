import { useQuery } from '@tanstack/react-query';
import { fetchPlatformBillingCheckoutOptions, shouldRetryPlatformBillingRead } from '../api/platformBillingApi';

export function usePlatformBillingCheckoutOptions(enabled: boolean) {
  return useQuery({
    queryKey: ['platform-billing', 'checkout-options'],
    queryFn: ({ signal }) => fetchPlatformBillingCheckoutOptions(signal),
    enabled,
    retry: shouldRetryPlatformBillingRead,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
