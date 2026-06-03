import { apiClient } from '@/shared/services/api/client';

export interface Gym {
  id: string;
  org_id: string;
  gymu_id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  is_active: boolean;
}

export const gymApi = {
  getGyms: async (): Promise<Gym[]> => {
    const response = await apiClient.get('/gyms');
    // Backend returns Response[List[GymResponse]] where Response has a data field
    return response.data.data;
  }
};
