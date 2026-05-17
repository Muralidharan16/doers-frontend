import { apiClient } from '@/shared/services/api/client';
import type { OrganizationProfile, OrganizationUpdatePayload } from '../types';

export const organizationApi = {
  getProfile: async (): Promise<OrganizationProfile> => {
    const response = await apiClient.get('/organizations/profile');
    return response.data.data;
  },

  updateProfile: async (payload: OrganizationUpdatePayload): Promise<OrganizationProfile> => {
    const response = await apiClient.patch('/organizations/profile', payload);
    return response.data.data;
  },
};
