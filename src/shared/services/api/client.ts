import axios from 'axios';
import { useTrialLockStore, type TrialLockCode } from '@/features/trial/store/trialLockStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
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

    const originalRequest = error.config;
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/auth/refresh' && 
      originalRequest.url !== '/auth/login'
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokensRaw = localStorage.getItem('auth-storage');
        const parsed = tokensRaw ? JSON.parse(tokensRaw) : null;
        const refreshToken = parsed?.state?.tokens?.refresh_token ?? parsed?.tokens?.refresh_token;

        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        // API might wrap response in `data: {}`
        const newAccessToken = data?.data?.access_token || data?.access_token;
        const newRefreshToken = data?.data?.refresh_token || data?.refresh_token;

        if (parsed?.state?.tokens) {
          parsed.state.tokens.access_token = newAccessToken;
          parsed.state.tokens.refresh_token = newRefreshToken;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('auth-storage');
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper to decode auth token payload
export const getAuthTokenPayload = (): any => {
  const tokensRaw = localStorage.getItem('auth-storage');
  if (tokensRaw) {
    try {
      const parsed = JSON.parse(tokensRaw);
      const tokens = parsed?.state?.tokens ?? parsed?.tokens;
      if (tokens?.access_token) {
        const parts = tokens.access_token.split('.');
        if (parts.length === 3) {
          return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        }
      }
    } catch {
      // ignore
    }
  }
  return null;
};

// Validate that a resource ID matches tenant context if needed
const validateTenantAccess = () => {
  const payload = getAuthTokenPayload();
  if (!payload?.org_id) {
    throw {
      response: {
        status: 403,
        data: { detail: "Access denied. No tenant ID found in token." }
      }
    };
  }
};

export const fetchBranches = async () => {
  validateTenantAccess();
  return apiClient.get('/branches');
};

export const addBranch = async (formData: any) => {
  validateTenantAccess();
  const payload = {
    name: formData.name,
    internal_code: formData.internal_code,
    address_line1: formData.address_line1,
    address_line2: formData.address_line2 || "",
    city: formData.address_city,
    state_province: formData.address_state,
    country_code: formData.country_code || "IN",
    postal_code: formData.address_pincode,
    phone: formData.contact_phone,
    email: formData.contact_email
  };
  return apiClient.post('/gyms', payload);
};

export const deleteBranch = async (gymId: string) => {
  validateTenantAccess();
  if (!gymId) throw new Error("Branch ID is required");
  return apiClient.delete(`/gyms/${gymId}`);
};

export const updateBranch = async (gymId: string, formData: any) => {
  validateTenantAccess();
  if (!gymId) throw new Error("Branch ID is required");
  const payload = {
    name: formData.name
  };
  return apiClient.put(`/gyms/${gymId}`, payload);
};

export const updateAddress = async (addressId: string, formData: any) => {
  validateTenantAccess();
  if (!addressId) throw new Error("Address ID is required");
  const payload = {
    address_line1: formData.address_line1,
    address_line2: formData.address_line2 || "",
    city: formData.address_city,
    state_province: formData.address_state,
    country_code: formData.country_code || "IN",
    postal_code: formData.address_pincode,
    address_type: "physical",
    label: formData.name + " Address"
  };
  return apiClient.patch(`/addresses/${addressId}`, payload);
};

export const transitionBranchStatus = async (branchId: string, formData: any) => {
  validateTenantAccess();
  if (!branchId) throw new Error("Branch ID is required");
  const payload = {
    to_status: formData.to_status.toLowerCase(), // active, maintenance, decommissioned
    reason: formData.reason || null
  };
  return apiClient.post(`/branches/${branchId}/transition`, payload);
};

export const pollTransitionStatus = async (branchId: string) => {
  validateTenantAccess();
  if (!branchId) throw new Error("Branch ID is required");
  return apiClient.get(`/branches/${branchId}/state`);
};
