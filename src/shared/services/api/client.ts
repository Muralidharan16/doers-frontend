import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const tokensRaw = localStorage.getItem('auth-storage');
  if (tokensRaw) {
    try {
      const { tokens } = JSON.parse(tokensRaw);
      if (tokens?.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`;
      }
    } catch (e) {
      // ignore parse error
    }
  }
  return config;
});