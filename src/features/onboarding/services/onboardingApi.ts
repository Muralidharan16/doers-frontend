import { apiClient } from '@/shared/services/api/client';
import type { CompleteOnboardingPayload, PincodeLookupResponse } from '../types';

export const onboardingApi = {
  lookupPincode: async (pincode: string): Promise<PincodeLookupResponse> => {
    const response = await apiClient.get(`/onboarding/pincode/${pincode}`);
    return response.data;
  },

  complete: async (payload: CompleteOnboardingPayload): Promise<void> => {
    await apiClient.post('/onboarding/complete', payload);
  },

  getStatus: async (): Promise<{ onboarding_completed: boolean }> => {
    const response = await apiClient.get('/onboarding/status');
    return response.data;
  },
};
