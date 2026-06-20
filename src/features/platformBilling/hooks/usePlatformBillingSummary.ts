import { useQuery } from '@tanstack/react-query';
import { fetchPlatformBillingSummary } from '../api/platformBillingApi';

export function usePlatformBillingSummary(enabled: boolean) {
  return useQuery({
    queryKey: ['platform-billing', 'summary'],
    queryFn: fetchPlatformBillingSummary,
    enabled,
    retry: 1,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
