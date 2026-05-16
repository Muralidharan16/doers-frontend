import { apiClient } from '@/shared/services/api/client';
import type { DashboardMetrics, ExpiringSubscription, CollectionSummary, AttendanceHeatmapData } from './types';

export const dashboardApi = {
  // Get main dashboard metrics
  getMetrics: async (gymId?: string) => {
    const params = gymId ? { gym_id: gymId } : {};
    const response = await apiClient.get<DashboardMetrics>('/reports/dashboard', { params });
    return response.data;
  },

  // Get expiring subscriptions
  getExpiringSubscriptions: async (days: number = 7, gymId?: string) => {
    const params = { days, ...(gymId && { gym_id: gymId }) };
    const response = await apiClient.get<ExpiringSubscription[]>('/reports/expiring', { params });
    return response.data;
  },

  // Get collection summary
  getCollections: async (dateFrom: string, dateTo: string, gymId?: string) => {
    const params = { date_from: dateFrom, date_to: dateTo, ...(gymId && { gym_id: gymId }) };
    const response = await apiClient.get<CollectionSummary[]>('/reports/collections', { params });
    return response.data;
  },

  // Get attendance heatmap data
  getAttendance: async (days: number = 30, gymId?: string) => {
    const params = { days, ...(gymId && { gym_id: gymId }) };
    const response = await apiClient.get<AttendanceHeatmapData[]>('/reports/attendance', { params });
    return response.data;
  },
};
