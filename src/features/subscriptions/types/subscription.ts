export type ModernSubscriptionStatus =
  | 'pending'
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'frozen'
  | 'archived';

export type SubscriptionMemberRole = 'primary' | 'additional';
export type SubscriptionDurationUnit = 'days' | 'months' | 'years';

export interface SubscriptionMember {
  id: string;
  org_id: string;
  subscription_id: string;
  member_id: string;
  slot_number: number;
  role: SubscriptionMemberRole;
  is_active: boolean;
  joined_at: string;
  left_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MemberSubscriptionV2 {
  id: string;
  org_id: string;
  branch_id: string;
  membership_plan_id: string;
  primary_member_id: string;
  subscription_code: string;
  start_date: string;
  end_date: string;
  status: ModernSubscriptionStatus;
  price_snapshot: number;
  currency_code: string;
  duration_value_snapshot: number;
  duration_unit_snapshot: SubscriptionDurationUnit;
  max_members_snapshot: number;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at?: string | null;
  cancelled_at?: string | null;
  archived_at?: string | null;
  members?: SubscriptionMember[];
}

export interface CreateSubscriptionPayload {
  branch_id: string;
  membership_plan_id: string;
  primary_member_id: string;
  start_date?: string | null;
}

export interface SubscriptionListParams {
  status?: ModernSubscriptionStatus;
  branch_id?: string;
  member_id?: string;
  membership_plan_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SubscriptionListResponse {
  data: MemberSubscriptionV2[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
