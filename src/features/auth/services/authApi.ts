import { apiClient } from '@/shared/services/api/client';
import type { LoginCredentials, AuthTokens, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await apiClient.post('/auth/login', credentials);
    const { data } = response.data;
    return {
      user: data.user,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
    };
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    const { data } = response.data;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};