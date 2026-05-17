import { apiClient } from '@/shared/services/api/client';
import type { 
  DashboardMetrics, 
  ExpiringSubscription, 
  CollectionSummary, 
  AttendanceHeatmapResponse 
} from '../types';

/**
 * Backend returns { status: "success", data: T, message: "" }
 * This helper extracts the 'data' field.
 */
const unwrap = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
};

export const dashboardApi = {
  // Get main dashboard metrics
  getMetrics: async (gymId?: string) => {
    const params = gymId ? { gym_id: gymId } : {};
    const response = await apiClient.get<DashboardMetrics>('/reports/dashboard', { params });
    return unwrap<DashboardMetrics>(response.data);
  },

  // Get expiring subscriptions
  getExpiringSubscriptions: async (days: number = 7, gymId?: string) => {
    const params = { days, ...(gymId && { gym_id: gymId }) };
    const response = await apiClient.get<ExpiringSubscription[]>('/reports/expiring', { params });
    return unwrap<ExpiringSubscription[]>(response.data);
  },

  // Get collection summary
  getCollections: async (dateFrom: string, dateTo: string, gymId?: string) => {
    const params = { date_from: dateFrom, date_to: dateTo, ...(gymId && { gym_id: gymId }) };
    const response = await apiClient.get<CollectionSummary[]>('/reports/collections', { params });
    return unwrap<CollectionSummary[]>(response.data);
  },

  // Get attendance heatmap data
  getAttendance: async (days: number = 30, gymId?: string) => {
    const params = { days, ...(gymId && { gym_id: gymId }) };
    const response = await apiClient.get<AttendanceHeatmapResponse>('/reports/attendance', { params });
    return unwrap<AttendanceHeatmapResponse>(response.data);
  },
};
