import { apiClient } from '@/shared/services/api/client';
import type { LoginCredentials, AuthTokens, SignupPayload, AuthResponse, SignupResponse, User } from '../types';

const unwrap = <T>(payload: T | { data: T }): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', {
      ...credentials,
      email: credentials.email.trim().toLowerCase(),
    });
    const data = unwrap<{
      user: AuthResponse['user'];
      access_token: string;
      refresh_token: string;
      onboarding_completed?: boolean;
    }>(response.data);

    return {
      user: data.user,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
      onboarding_completed: Boolean(data.onboarding_completed),
    };
  },

  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const response = await apiClient.post('/auth/signup', {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });
    return response.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/resend-verification', { email: email.trim().toLowerCase() });
    return response.data;
  },

  signupStatus: async (email: string, pollToken: string): Promise<{ 
    status: string; 
    onboarding_completed?: boolean;
    access_token?: string;
    refresh_token?: string;
    user?: { id: string; email: string; name: string; organizationName?: string; };
  }> => {
    const response = await apiClient.get('/auth/signup-status', {
      params: { email: email.trim().toLowerCase(), poll_token: pollToken },
    });
    return unwrap<{ 
      status: string; 
      onboarding_completed?: boolean;
      access_token?: string;
      refresh_token?: string;
      user?: { id: string; email: string; name: string; organizationName?: string; };
    }>(response.data);
  },

  refresh: async (refreshToken: string): Promise<AuthTokens & { onboarding_completed?: boolean }> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    const data = unwrap<{
      access_token: string;
      refresh_token: string;
      onboarding_completed?: boolean;
    }>(response.data);

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      onboarding_completed: data.onboarding_completed,
    };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return unwrap<User>(response.data);
  },
};
