export type PlatformAccessMode = 'full' | 'limited_write' | 'read_only' | 'billing_only' | 'blocked';

export interface PlatformBillingAccessSummary {
  mode: PlatformAccessMode;
  safe_reason_code: string;
  effective_from: string | null;
  next_transition_at: string | null;
  recovery_actions: string[];
  projection_freshness: string;
}

export interface PlatformBillingPlanSummary {
  code: string | null;
  display_name: string | null;
  status: string | null;
}

export interface PlatformBillingPeriodSummary {
  period_start: string | null;
  period_end: string | null;
  subscription_status: string | null;
  cancel_at_period_end: boolean;
}

export interface PlatformBillingEntitlementSummary {
  key: string;
  value_type: 'boolean' | 'integer' | 'string' | 'json';
  value: boolean | number | string | Record<string, unknown>;
}

export interface PlatformBillingUsageSummary {
  key: string;
  current: number;
  limit: number | null;
  over_limit: boolean | null;
  stale_after: string | null;
}

export interface PlatformBillingSummary {
  schema_version: number;
  organization_id: string;
  access: PlatformBillingAccessSummary;
  plan: PlatformBillingPlanSummary;
  billing_period: PlatformBillingPeriodSummary;
  entitlements: PlatformBillingEntitlementSummary[];
  usage: PlatformBillingUsageSummary[];
  decision_availability: {
    available: boolean;
    reason: string | null;
  };
  server_time: string;
}
