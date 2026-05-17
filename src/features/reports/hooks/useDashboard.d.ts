export declare const useDashboardMetrics: (gymId?: string) => import("@tanstack/react-query").UseQueryResult<import("..").DashboardMetrics, Error>;
export declare const useExpiringSubscriptions: (days?: number, gymId?: string) => import("@tanstack/react-query").UseQueryResult<import("..").ExpiringSubscription[], Error>;
export declare const useCollections: (dateFrom: string, dateTo: string, gymId?: string) => import("@tanstack/react-query").UseQueryResult<import("..").CollectionSummary[], Error>;
export declare const useAttendance: (days?: number, gymId?: string) => import("@tanstack/react-query").UseQueryResult<import("..").AttendanceHeatmapResponse, Error>;
