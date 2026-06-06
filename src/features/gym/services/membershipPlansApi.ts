import { apiClient } from '@/shared/services/api/client';
import type {
  MembershipPlan,
  CreateMembershipPlanPayload,
  UpdateMembershipPlanPayload,
  MembershipPlanListParams,
} from '../types/membershipPlans';

export const getMembershipPlans = async (params?: MembershipPlanListParams): Promise<MembershipPlan[]> => {
  const response = await apiClient.get('/membership-plans', { params });
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getMembershipPlan = async (planId: string): Promise<MembershipPlan> => {
  const response = await apiClient.get(`/membership-plans/${planId}`);
  return response.data;
};

export const createMembershipPlan = async (payload: CreateMembershipPlanPayload): Promise<MembershipPlan> => {
  const response = await apiClient.post('/membership-plans', payload);
  return response.data;
};

export const updateMembershipPlan = async (planId: string, payload: UpdateMembershipPlanPayload): Promise<MembershipPlan> => {
  const response = await apiClient.patch(`/membership-plans/${planId}`, payload);
  return response.data;
};

export const archiveMembershipPlan = async (planId: string): Promise<MembershipPlan> => {
  const response = await apiClient.post(`/membership-plans/${planId}/archive`);
  return response.data;
};

export const activateMembershipPlan = async (planId: string): Promise<MembershipPlan> => {
  const response = await apiClient.post(`/membership-plans/${planId}/activate`);
  return response.data;
};

export const deactivateMembershipPlan = async (planId: string): Promise<MembershipPlan> => {
  const response = await apiClient.post(`/membership-plans/${planId}/deactivate`);
  return response.data;
};
