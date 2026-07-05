import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMembershipPlans,
  getMembershipPlan,
  createMembershipPlan,
  updateMembershipPlan,
  archiveMembershipPlan,
  activateMembershipPlan,
  deactivateMembershipPlan,
} from '../services/membershipPlansApi';
import type {
  MembershipPlanListParams,
  CreateMembershipPlanPayload,
  UpdateMembershipPlanPayload,
} from '../types/membershipPlans';

export const membershipPlansKeys = {
  all: ['membershipPlans'] as const,
  lists: () => [...membershipPlansKeys.all, 'list'] as const,
  list: (params?: MembershipPlanListParams) => [...membershipPlansKeys.lists(), params] as const,
  detail: (planId: string) => [...membershipPlansKeys.all, 'detail', planId] as const,
};

// --- List ---

export const useMembershipPlans = (
  params?: MembershipPlanListParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: membershipPlansKeys.list(params),
    queryFn: () => getMembershipPlans(params),
    enabled: options?.enabled ?? true,
  });
};

// --- Detail ---

export const useMembershipPlan = (planId: string) => {
  return useQuery({
    queryKey: membershipPlansKeys.detail(planId),
    queryFn: () => getMembershipPlan(planId),
    enabled: !!planId,
  });
};

// --- Create ---

export const useCreateMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMembershipPlanPayload) => createMembershipPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.lists() });
    },
  });
};

// --- Update ---

export const useUpdateMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, payload }: { planId: string; payload: UpdateMembershipPlanPayload }) =>
      updateMembershipPlan(planId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.detail(variables.planId) });
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.lists() });
    },
  });
};

// --- Archive ---

export const useArchiveMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => archiveMembershipPlan(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.lists() });
    },
  });
};

// --- Activate ---

export const useActivateMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => activateMembershipPlan(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.lists() });
    },
  });
};

// --- Deactivate ---

export const useDeactivateMembershipPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => deactivateMembershipPlan(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: membershipPlansKeys.lists() });
    },
  });
};
