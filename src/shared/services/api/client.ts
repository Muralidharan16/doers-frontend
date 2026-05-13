import axios from 'axios';
import { useTrialLockStore, type TrialLockCode } from '@/features/trial/store/trialLockStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const tokensRaw = localStorage.getItem('auth-storage');
  if (tokensRaw) {
    try {
      const parsed = JSON.parse(tokensRaw);
      const tokens = parsed?.state?.tokens ?? parsed?.tokens;
      if (tokens?.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`;
      }
    } catch {
      // ignore parse error
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    const code = detail?.code as TrialLockCode | undefined;

    if (code === 'SOFT_LOCKED' || code === 'HARD_LOCKED') {
      useTrialLockStore.getState().setLock(
        code,
        detail?.message || 'Your trial access needs attention.'
      );

      if (code === 'HARD_LOCKED' && window.location.pathname !== '/subscription-required') {
        window.location.assign('/subscription-required');
      }
    }

    return Promise.reject(error);
  }
);
