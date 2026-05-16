export interface DashboardMetrics {
  total_revenue_month: number;
  active_members: number;
  new_members_month: number;
  expired_month: number;
  churn_rate: number;
}

export interface ExpiringSubscription {
  id: string;
  member_name: string;
  email: string;
  phone?: string;
  days_remaining: number;
  expiry_date: string;
}

export interface CollectionSummary {
  date: string;
  cash: number;
  upi: number;
  card: number;
  other: number;
  total: number;
}

export interface AttendanceHeatmapData {
  hour: number;
  count: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  expiring: ExpiringSubscription[];
  collections: CollectionSummary[];
  attendance: AttendanceHeatmapData[];
}
