import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useTrialLockStore, type TrialLockCode } from '@/features/trial/store/trialLockStore';
import {
  broadcastSignedOut,
  useAuthStore,
} from '@/features/auth/store/authStore';
import { resolveApiBaseUrl } from '../../config/apiBaseUrl';

const API_BASE_URL = resolveApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL,
  { isProduction: import.meta.env.PROD },
);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type ErrorPayload = { detail?: { code?: TrialLockCode; message?: string } };
type SessionRoutingMetadata = { org_id: string; role: string };

const publicAuthRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/register',
  '/auth/resend-verification',
  '/auth/signup-status',
  '/auth/refresh',
  '/auth/logout',
];

const isPublicAuthRoute = (url?: string): boolean =>
  Boolean(url && publicAuthRoutes.some((route) => url.includes(route)));

let refreshPromise: Promise<void> | null = null;

const refreshBrowserSession = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const failClosedBrowserSession = (): void => {
  useAuthStore.getState().clearAuth();
  window.localStorage.removeItem('branch-storage');
  broadcastSignedOut();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const payload = error.response?.data as ErrorPayload | undefined;
    const detail = payload?.detail;
    const code = detail?.code;

    if (code === 'SOFT_LOCKED' || code === 'HARD_LOCKED') {
      useTrialLockStore.getState().setLock(
        code,
        detail?.message || 'Your trial access needs attention.',
      );

      if (code === 'HARD_LOCKED' && window.location.pathname !== '/subscription-required') {
        window.location.assign('/subscription-required');
      }
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isPublicAuthRoute(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshBrowserSession();
      return apiClient(originalRequest);
    } catch (refreshError) {
      failClosedBrowserSession();
      return Promise.reject(refreshError);
    }
  },
);

/**
 * @deprecated Legacy call-site name retained only for the PR-02B integration
 * boundary. This function never reads or decodes a token. It returns non-secret
 * routing metadata established by the authenticated server session response.
 */
export const getAuthTokenPayload = (): SessionRoutingMetadata => {
  const { status, user } = useAuthStore.getState();
  if (status !== 'authenticated' || !user) {
    return { org_id: '', role: 'unauthenticated' };
  }
  return { org_id: user.org_id, role: user.role };
};

export const fetchBranches = async () => apiClient.get('/branches');

interface BranchFormPayload {
  name?: string;
  internal_code?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  country_code?: string;
  address_pincode?: string;
  contact_phone?: string;
  contact_email?: string;
  to_status?: string;
  reason?: string | null;
}

export const addBranch = async (formData: BranchFormPayload) => {
  const payload = {
    name: formData.name,
    internal_code: formData.internal_code,
    address_line1: formData.address_line1,
    address_line2: formData.address_line2 || '',
    city: formData.address_city,
    state_province: formData.address_state,
    country_code: formData.country_code || 'IN',
    postal_code: formData.address_pincode,
    phone: formData.contact_phone,
    email: formData.contact_email,
  };
  return apiClient.post('/gyms', payload);
};

export const deleteBranch = async (gymId: string) => {
  if (!gymId) throw new Error('Branch ID is required');
  return apiClient.delete(`/gyms/${gymId}`);
};

export const updateBranch = async (gymId: string, formData: BranchFormPayload) => {
  if (!gymId) throw new Error('Branch ID is required');
  return apiClient.put(`/gyms/${gymId}`, { name: formData.name });
};

export const updateAddress = async (addressId: string, formData: BranchFormPayload) => {
  if (!addressId) throw new Error('Address ID is required');
  const payload = {
    address_line1: formData.address_line1,
    address_line2: formData.address_line2 || '',
    city: formData.address_city,
    state_province: formData.address_state,
    country_code: formData.country_code || 'IN',
    postal_code: formData.address_pincode,
    address_type: 'physical',
    label: `${formData.name} Address`,
  };
  return apiClient.patch(`/addresses/${addressId}`, payload);
};

export const transitionBranchStatus = async (branchId: string, formData: BranchFormPayload) => {
  if (!branchId) throw new Error('Branch ID is required');
  const payload = {
    to_status: formData.to_status?.toLowerCase(),
    reason: formData.reason || null,
  };
  return apiClient.post(`/branches/${branchId}/transition`, payload);
};

export const pollTransitionStatus = async (branchId: string) => {
  if (!branchId) throw new Error('Branch ID is required');
  return apiClient.get(`/branches/${branchId}/state`);
};
