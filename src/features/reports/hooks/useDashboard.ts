import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/reportsApi';

export const useDashboardMetrics = (gymId?: string) => {
  return useQuery({
    queryKey: ['dashboard-metrics', gymId],
    queryFn: () => dashboardApi.getMetrics(gymId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExpiringSubscriptions = (days: number = 7, gymId?: string) => {
  return useQuery({
    queryKey: ['expiring-subscriptions', days, gymId],
    queryFn: () => dashboardApi.getExpiringSubscriptions(days, gymId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCollections = (dateFrom: string, dateTo: string, gymId?: string) => {
  return useQuery({
    queryKey: ['collections', dateFrom, dateTo, gymId],
    queryFn: () => dashboardApi.getCollections(dateFrom, dateTo, gymId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAttendance = (days: number = 30, gymId?: string) => {
  return useQuery({
    queryKey: ['attendance', days, gymId],
    queryFn: () => dashboardApi.getAttendance(days, gymId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
