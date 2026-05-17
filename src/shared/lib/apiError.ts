import axios from 'axios';

interface ApiDetail {
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const detail = error.response?.data?.detail as string | ApiDetail | undefined;
  if (typeof detail === 'string') return detail;
  if (detail?.message) return detail.message;

  return error.message || fallback;
}
