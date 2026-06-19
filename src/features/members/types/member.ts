export type MemberStatus = 'active' | 'inactive' | 'frozen' | 'expired' | 'blocked';

export interface Member {
  id: string;
  org_id: string;
  gym_id?: string | null;
  home_branch_id?: string | null;
  member_uid: string;
  member_number: number;
  member_display_code?: string | null;
  home_branch_name?: string | null;
  has_active_subscription?: boolean;
  active_subscription_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  address?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  qr_token?: string | null;
  status: MemberStatus;
  is_active: boolean;
  notes?: string | null;
  created_at?: string;
}

export interface CreateMemberPayload {
  name: string;
  phone: string;
  home_branch_id: string;
  email?: string | null;
  date_of_birth: string;
  gender?: string | null;
  blood_group?: string | null;
  emergency_contact_name: string;
  emergency_contact_phone?: string | null;
  address?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  notes?: string | null;
}

export interface UpdateMemberPayload {
  name?: string;
  phone?: string;
  home_branch_id?: string | null;
  email?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  address?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  notes?: string | null;
  status?: MemberStatus;
}

export interface MemberListParams {
  search?: string;
  status?: MemberStatus;
  home_branch_id?: string;
  branch_id?: string;
  has_active_subscription?: boolean;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface MemberListResponse {
  data: Member[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
