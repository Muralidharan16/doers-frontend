export type MembershipPlanStatus = 'active' | 'inactive' | 'archived';
export type DurationUnit = 'days' | 'months' | 'years';

export interface MembershipPlan {
  id: string;
  org_id: string;
  branch_id: string | null;
  plan_code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  duration_value: number;
  duration_unit: DurationUnit;
  max_members: number;
  valid_from: string | null;
  valid_until: string | null;
  status: MembershipPlanStatus;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface CreateMembershipPlanPayload {
  name: string;
  description?: string | null;
  price: number;
  duration_value: number;
  duration_unit: DurationUnit;
  max_members?: number;
  branch_id?: string | null;
  valid_from?: string | null;
  valid_until?: string | null;
}

export interface UpdateMembershipPlanPayload {
  name?: string;
  description?: string | null;
  price?: number;
  duration_value?: number;
  duration_unit?: DurationUnit;
  max_members?: number;
  valid_from?: string | null;
  valid_until?: string | null;
}

export interface MembershipPlanListParams {
  plan_status?: MembershipPlanStatus;
  branch_id?: string;
}
