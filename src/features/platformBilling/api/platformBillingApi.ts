import { apiClient } from '@/shared/services/api/client';
import type { PlatformBillingSummary } from '../types';

export async function fetchPlatformBillingSummary(): Promise<PlatformBillingSummary> {
  const response = await apiClient.get<PlatformBillingSummary>('/api/v1/platform-billing/summary');
  return response.data;
}
