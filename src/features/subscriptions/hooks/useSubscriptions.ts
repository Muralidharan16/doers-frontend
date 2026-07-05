import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubscription,
  getSubscription,
  getSubscriptions,
} from '../services';
import type { CreateSubscriptionPayload, SubscriptionListParams } from '../types';

export const subscriptionsKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionsKeys.all, 'list'] as const,
  list: (orgId: string, params?: SubscriptionListParams) =>
    [...subscriptionsKeys.lists(), orgId, params] as const,
  details: () => [...subscriptionsKeys.all, 'detail'] as const,
  detail: (orgId: string, subscriptionId: string) =>
    [...subscriptionsKeys.details(), orgId, subscriptionId] as const,
};

const requireOrgId = (orgId: string | undefined): string => {
  if (!orgId) throw new Error('Organization ID is required.');
  return orgId;
};

export const useSubscriptions = (
  orgId: string | undefined,
  params?: SubscriptionListParams
) => {
  return useQuery({
    queryKey: subscriptionsKeys.list(orgId ?? '', params),
    queryFn: () => getSubscriptions(requireOrgId(orgId), params),
    enabled: !!orgId,
  });
};

export const useSubscription = (
  orgId: string | undefined,
  subscriptionId: string | undefined
) => {
  return useQuery({
    queryKey: subscriptionsKeys.detail(orgId ?? '', subscriptionId ?? ''),
    queryFn: () => getSubscription(requireOrgId(orgId), subscriptionId as string),
    enabled: !!orgId && !!subscriptionId,
  });
};

export const useCreateSubscription = (orgId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      createSubscription(requireOrgId(orgId), payload),
    onSuccess: (subscription) => {
      if (!orgId) return;
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: subscriptionsKeys.detail(orgId, subscription.id),
      });
    },
  });
};
