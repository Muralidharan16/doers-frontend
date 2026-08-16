import { apiClient } from '@/shared/services/api/client';
import type {
  LoginCredentials,
  RefreshResponse,
  SessionResponse,
  SignupPayload,
  SignupResponse,
  SignupStatusResponse,
} from '../types';

const unwrap = <T>(payload: T | { data: T }): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<SessionResponse> => {
    const response = await apiClient.post('/auth/login', {
      ...credentials,
      email: credentials.email.trim().toLowerCase(),
    });
    return unwrap<SessionResponse>(response.data);
  },

  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const response = await apiClient.post('/auth/signup', {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });
    return unwrap<SignupResponse>(response.data);
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/resend-verification', {
      email: email.trim().toLowerCase(),
    });
    return unwrap<{ message: string }>(response.data);
  },

  signupStatus: async (email: string): Promise<SignupStatusResponse> => {
    const response = await apiClient.post('/auth/signup-status', {
      email: email.trim().toLowerCase(),
    });
    return unwrap<SignupStatusResponse>(response.data);
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await apiClient.post('/auth/refresh');
    return unwrap<RefreshResponse>(response.data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getSession: async (): Promise<SessionResponse> => {
    const response = await apiClient.get('/auth/me');
    return unwrap<SessionResponse>(response.data);
  },
};
