import { apiClient } from '@/shared/services/api/client';
import type {
  CreateMemberPayload,
  Member,
  MemberListParams,
  MemberListResponse,
  UpdateMemberPayload,
} from '../types';

type ApiEnvelope<T> = {
  data?: T;
};

type ApiListEnvelope = {
  data?: unknown;
  total?: unknown;
  page?: unknown;
  size?: unknown;
  page_size?: unknown;
  pages?: unknown;
};

type NormalizedListEnvelope = {
  data: unknown[];
  total?: unknown;
  page?: unknown;
  size?: unknown;
  page_size?: unknown;
  pages?: unknown;
};

const forbiddenPayloadKeys = new Set([
  'id',
  'org_id',
  'gym_id',
  'member_uid',
  'member_number',
  'member_display_code',
  'has_active_subscription',
  'active_subscription_id',
  'home_branch_name',
  'qr_token',
  'created_by',
  'updated_by',
  'is_active',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isMember = (value: unknown): value is Member => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.org_id === 'string' &&
    typeof value.member_uid === 'string' &&
    typeof value.member_number === 'number' &&
    typeof value.name === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.status === 'string' &&
    typeof value.is_active === 'boolean'
  );
};

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const cleanOptionalRequiredString = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const cleanNullableString = (value: string | null | undefined): string | null | undefined => {
  if (value === null || value === undefined) return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

const normalizeMemberResponse = (value: unknown): Member => {
  if (isMember(value)) return value;
  if (isRecord(value)) {
    const data = (value as ApiEnvelope<unknown>).data;
    if (isMember(data)) return data;
  }
  throw new Error('Unexpected member response shape.');
};

const normalizeMemberListResponse = (value: unknown, params?: MemberListParams): MemberListResponse => {
  if (Array.isArray(value)) {
    if (!value.every(isMember)) {
      throw new Error('Unexpected member list item shape.');
    }
    return {
      data: value,
      total: value.length,
      page: params?.page ?? 1,
      size: params?.limit ?? value.length,
      pages: 1,
    };
  }

  if (!isRecord(value)) {
    throw new Error('Unexpected member list response shape.');
  }

  const envelope = value as ApiListEnvelope;
  let listEnvelope: NormalizedListEnvelope | null = null;
  if (Array.isArray(envelope.data)) {
    listEnvelope = { ...envelope, data: envelope.data };
  } else if (isRecord(envelope.data) && Array.isArray(envelope.data.data)) {
    const nested = envelope.data as ApiListEnvelope;
    const nestedData = envelope.data.data;
    listEnvelope = {
      data: nestedData,
      total: nested.total ?? envelope.total,
      page: nested.page ?? envelope.page,
      size: nested.size ?? envelope.size,
      page_size: nested.page_size ?? envelope.page_size,
      pages: nested.pages ?? envelope.pages,
    };
  }

  if (!listEnvelope || !listEnvelope.data.every(isMember)) {
    throw new Error('Unexpected member list response shape.');
  }

  const size = asNumber(listEnvelope.size, asNumber(listEnvelope.page_size, params?.limit ?? listEnvelope.data.length));

  return {
    data: listEnvelope.data,
    total: asNumber(listEnvelope.total, listEnvelope.data.length),
    page: asNumber(listEnvelope.page, params?.page ?? 1),
    size,
    pages: asNumber(listEnvelope.pages, size > 0 ? Math.ceil(listEnvelope.data.length / size) : 0),
  };
};

const cleanPayload = <T extends Record<string, unknown>>(payload: T): T => {
  return Object.entries(payload).reduce<Partial<T>>((cleaned, [key, value]) => {
    if (forbiddenPayloadKeys.has(key)) return cleaned;
    if (value === undefined) return cleaned;
    cleaned[key as keyof T] = value as T[keyof T];
    return cleaned;
  }, {}) as T;
};

export const cleanCreateMemberPayload = (payload: CreateMemberPayload): CreateMemberPayload => {
  return cleanPayload({
    ...payload,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    home_branch_id: payload.home_branch_id.trim(),
    email: cleanNullableString(payload.email),
    date_of_birth: payload.date_of_birth.trim(),
    gender: cleanNullableString(payload.gender),
    blood_group: cleanNullableString(payload.blood_group),
    emergency_contact_name: payload.emergency_contact_name.trim(),
    emergency_contact_phone: cleanNullableString(payload.emergency_contact_phone),
    address: cleanNullableString(payload.address),
    notes: cleanNullableString(payload.notes),
  });
};

export const cleanUpdateMemberPayload = (payload: UpdateMemberPayload): UpdateMemberPayload => {
  return cleanPayload({
    ...payload,
    name: cleanOptionalRequiredString(payload.name),
    phone: cleanOptionalRequiredString(payload.phone),
    home_branch_id: cleanNullableString(payload.home_branch_id),
    email: cleanNullableString(payload.email),
    date_of_birth: cleanNullableString(payload.date_of_birth),
    gender: cleanNullableString(payload.gender),
    blood_group: cleanNullableString(payload.blood_group),
    emergency_contact_name: cleanNullableString(payload.emergency_contact_name),
    emergency_contact_phone: cleanNullableString(payload.emergency_contact_phone),
    address: cleanNullableString(payload.address),
    notes: cleanNullableString(payload.notes),
  });
};

const toApiParams = (params?: MemberListParams) => {
  if (!params) return undefined;
  const { limit, ...rest } = params;
  const apiParams = {
    ...rest,
    page_size: limit,
  };
  return Object.fromEntries(
    Object.entries(apiParams).filter(([, value]) => value !== undefined && value !== '')
  );
};

export const getMembers = async (
  orgId: string,
  params?: MemberListParams
): Promise<MemberListResponse> => {
  const response = await apiClient.get(`/organizations/${orgId}/members`, {
    params: toApiParams(params),
  });
  return normalizeMemberListResponse(response.data, params);
};

export const getMember = async (orgId: string, memberId: string): Promise<Member> => {
  const response = await apiClient.get(`/organizations/${orgId}/members/${memberId}`);
  return normalizeMemberResponse(response.data);
};

export const createMember = async (
  orgId: string,
  payload: CreateMemberPayload
): Promise<Member> => {
  const response = await apiClient.post(
    `/organizations/${orgId}/members`,
    cleanCreateMemberPayload(payload)
  );
  return normalizeMemberResponse(response.data);
};

export const updateMember = async (
  orgId: string,
  memberId: string,
  payload: UpdateMemberPayload
): Promise<Member> => {
  const response = await apiClient.patch(
    `/organizations/${orgId}/members/${memberId}`,
    cleanUpdateMemberPayload(payload)
  );
  return normalizeMemberResponse(response.data);
};

export const deleteMember = async (orgId: string, memberId: string): Promise<void> => {
  await apiClient.delete(`/organizations/${orgId}/members/${memberId}`);
};
