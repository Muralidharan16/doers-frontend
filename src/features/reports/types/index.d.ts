export interface DashboardMetrics {
    total_revenue_month: number;
    active_members: number;
    new_members_month: number;
    expired_month: number;
    churned_members: number;
    churn_rate: number;
}
export interface ExpiringSubscription {
    member_id: string;
    member_name: string;
    email: string;
    phone?: string;
    days_remaining: number;
    end_date: string;
    plan_name: string;
}
export interface CollectionSummary {
    date: string;
    cash: number;
    upi: number;
    card: number;
    total: number;
    count: number;
}
export interface AttendanceHeatmapData {
    hour: number;
    count: number;
}
export interface AttendanceHeatmapResponse {
    hours: AttendanceHeatmapData[];
    days_analyzed: number;
}
export interface DashboardData {
    metrics: DashboardMetrics;
    expiring: ExpiringSubscription[];
    collections: CollectionSummary[];
    attendance: AttendanceHeatmapData[];
}
