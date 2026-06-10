import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMember,
  deleteMember,
  getMember,
  getMembers,
  updateMember,
} from '../services';
import type {
  CreateMemberPayload,
  MemberListParams,
  UpdateMemberPayload,
} from '../types';

export const membersKeys = {
  all: ['members'] as const,
  lists: () => [...membersKeys.all, 'list'] as const,
  list: (orgId: string, params?: MemberListParams) =>
    [...membersKeys.lists(), orgId, params] as const,
  details: () => [...membersKeys.all, 'detail'] as const,
  detail: (orgId: string, memberId: string) =>
    [...membersKeys.details(), orgId, memberId] as const,
};

const requireOrgId = (orgId: string | undefined): string => {
  if (!orgId) throw new Error('Organization ID is required.');
  return orgId;
};

export const useMembers = (orgId: string | undefined, params?: MemberListParams) => {
  return useQuery({
    queryKey: membersKeys.list(orgId ?? '', params),
    queryFn: () => getMembers(requireOrgId(orgId), params),
    enabled: !!orgId,
  });
};

export const useMember = (orgId: string | undefined, memberId: string | undefined) => {
  return useQuery({
    queryKey: membersKeys.detail(orgId ?? '', memberId ?? ''),
    queryFn: () => getMember(requireOrgId(orgId), memberId as string),
    enabled: !!orgId && !!memberId,
  });
};

export const useCreateMember = (orgId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemberPayload) => createMember(requireOrgId(orgId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
    },
  });
};

export const useUpdateMember = (orgId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, payload }: { memberId: string; payload: UpdateMemberPayload }) =>
      updateMember(requireOrgId(orgId), memberId, payload),
    onSuccess: (_, variables) => {
      if (!orgId) return;
      queryClient.invalidateQueries({ queryKey: membersKeys.detail(orgId, variables.memberId) });
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
    },
  });
};

export const useDeleteMember = (orgId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteMember(requireOrgId(orgId), memberId),
    onSuccess: (_, memberId) => {
      if (!orgId) return;
      queryClient.invalidateQueries({ queryKey: membersKeys.detail(orgId, memberId) });
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
    },
  });
};
