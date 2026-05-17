import type { DashboardMetrics, ExpiringSubscription, CollectionSummary, AttendanceHeatmapResponse } from '../types';
export declare const dashboardApi: {
    getMetrics: (gymId?: string) => Promise<DashboardMetrics>;
    getExpiringSubscriptions: (days?: number, gymId?: string) => Promise<ExpiringSubscription[]>;
    getCollections: (dateFrom: string, dateTo: string, gymId?: string) => Promise<CollectionSummary[]>;
    getAttendance: (days?: number, gymId?: string) => Promise<AttendanceHeatmapResponse>;
};
