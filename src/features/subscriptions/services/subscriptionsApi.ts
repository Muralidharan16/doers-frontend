import { apiClient } from '@/shared/services/api/client';
import type {
  CreateSubscriptionPayload,
  MemberSubscriptionV2,
  ModernSubscriptionStatus,
  SubscriptionDurationUnit,
  SubscriptionListParams,
  SubscriptionListResponse,
  SubscriptionMember,
  SubscriptionMemberRole,
} from '../types';

type ApiListEnvelope = {
  data?: unknown;
  total?: unknown;
  page?: unknown;
  size?: unknown;
  page_size?: unknown;
  pages?: unknown;
};

const forbiddenCreatePayloadKeys = new Set([
  'org_id',
  'subscription_code',
  'end_date',
  'status',
  'price_snapshot',
  'currency_code',
  'duration_value_snapshot',
  'duration_unit_snapshot',
  'max_members_snapshot',
  'created_by',
  'updated_by',
  'members',
  'payment_status',
  'invoice_id',
]);

const subscriptionStatuses = new Set<ModernSubscriptionStatus>([
  'pending',
  'active',
  'expired',
  'cancelled',
  'frozen',
  'archived',
]);

const subscriptionRoles = new Set<SubscriptionMemberRole>(['primary', 'additional']);
const durationUnits = new Set<SubscriptionDurationUnit>(['days', 'months', 'years']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const asNumber = (value: unknown, fallback: number): number => {
  if (isNumber(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const isSubscriptionMember = (value: unknown): value is SubscriptionMember => {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.org_id) &&
    isString(value.subscription_id) &&
    isString(value.member_id) &&
    isNumber(value.slot_number) &&
    isString(value.role) &&
    subscriptionRoles.has(value.role as SubscriptionMemberRole) &&
    typeof value.is_active === 'boolean' &&
    isString(value.joined_at) &&
    isString(value.created_at)
  );
};

const isSubscription = (value: unknown): value is MemberSubscriptionV2 => {
  if (!isRecord(value)) return false;
  const members = value.members;
  return (
    isString(value.id) &&
    isString(value.org_id) &&
    isString(value.branch_id) &&
    isString(value.membership_plan_id) &&
    isString(value.primary_member_id) &&
    isString(value.subscription_code) &&
    isString(value.start_date) &&
    isString(value.end_date) &&
    isString(value.status) &&
    subscriptionStatuses.has(value.status as ModernSubscriptionStatus) &&
    (isNumber(value.price_snapshot) || isString(value.price_snapshot)) &&
    isString(value.currency_code) &&
    isNumber(value.duration_value_snapshot) &&
    isString(value.duration_unit_snapshot) &&
    durationUnits.has(value.duration_unit_snapshot as SubscriptionDurationUnit) &&
    isNumber(value.max_members_snapshot) &&
    isString(value.created_at) &&
    (members === undefined || (Array.isArray(members) && members.every(isSubscriptionMember)))
  );
};

const normalizeSubscription = (value: unknown): MemberSubscriptionV2 => {
  if (isSubscription(value)) {
    return {
      ...value,
      price_snapshot: asNumber(value.price_snapshot, 0),
      members: value.members ?? [],
    };
  }

  if (isRecord(value) && isSubscription(value.data)) {
    return {
      ...value.data,
      price_snapshot: asNumber(value.data.price_snapshot, 0),
      members: value.data.members ?? [],
    };
  }

  throw new Error('Unexpected subscription response shape.');
};

const normalizeSubscriptionList = (
  value: unknown,
  params?: SubscriptionListParams
): SubscriptionListResponse => {
  if (!isRecord(value)) {
    throw new Error('Unexpected subscription list response shape.');
  }

  const envelope = value as ApiListEnvelope;
  if (!Array.isArray(envelope.data)) {
    throw new Error('Unexpected subscription list response shape.');
  }

  const data = envelope.data.map(normalizeSubscription);
  const size = asNumber(envelope.size, asNumber(envelope.page_size, params?.limit ?? data.length));

  return {
    data,
    total: asNumber(envelope.total, data.length),
    page: asNumber(envelope.page, params?.page ?? 1),
    size,
    pages: asNumber(envelope.pages, size > 0 ? Math.ceil(data.length / size) : 0),
  };
};

const cleanNullableDate = (value: string | null | undefined): string | null | undefined => {
  if (value === null || value === undefined) return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const cleanPayload = <T extends Record<string, unknown>>(payload: T): Partial<T> => {
  return Object.entries(payload).reduce<Partial<T>>((cleaned, [key, value]) => {
    if (forbiddenCreatePayloadKeys.has(key)) return cleaned;
    if (value === undefined) return cleaned;
    cleaned[key as keyof T] = value as T[keyof T];
    return cleaned;
  }, {});
};

export const cleanCreateSubscriptionPayload = (
  payload: CreateSubscriptionPayload
): CreateSubscriptionPayload => {
  return cleanPayload({
    ...payload,
    branch_id: payload.branch_id.trim(),
    membership_plan_id: payload.membership_plan_id.trim(),
    primary_member_id: payload.primary_member_id.trim(),
    start_date: cleanNullableDate(payload.start_date),
  }) as CreateSubscriptionPayload;
};

const toApiParams = (params?: SubscriptionListParams) => {
  if (!params) return undefined;
  const { limit, ...rest } = params;
  return {
    ...rest,
    page_size: limit,
  };
};

export const getSubscriptions = async (
  orgId: string,
  params?: SubscriptionListParams
): Promise<SubscriptionListResponse> => {
  const response = await apiClient.get(`/organizations/${orgId}/subscriptions`, {
    params: toApiParams(params),
  });
  return normalizeSubscriptionList(response.data, params);
};

export const getSubscription = async (
  orgId: string,
  subscriptionId: string
): Promise<MemberSubscriptionV2> => {
  const response = await apiClient.get(
    `/organizations/${orgId}/subscriptions/${subscriptionId}`
  );
  return normalizeSubscription(response.data);
};

export const createSubscription = async (
  orgId: string,
  payload: CreateSubscriptionPayload
): Promise<MemberSubscriptionV2> => {
  const response = await apiClient.post(
    `/organizations/${orgId}/subscriptions`,
    cleanCreateSubscriptionPayload(payload)
  );
  return normalizeSubscription(response.data);
};
