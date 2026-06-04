import { apiClient } from '@/shared/services/api/client';
import type { BranchContact, CreateBranchContactPayload, UpdateBranchContactPayload } from '../types/branchContacts';

export const getBranchContacts = async (branchId: string): Promise<BranchContact[]> => {
  const response = await apiClient.get(`/branches/${branchId}/contacts`);
  const data = response.data;
  
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.contacts)) return data.contacts;
  if (Array.isArray(data?.items)) return data.items;
  
  return [];
};

export const createBranchContact = async (branchId: string, payload: CreateBranchContactPayload): Promise<BranchContact> => {
  const response = await apiClient.post(`/branches/${branchId}/contacts`, payload);
  return response.data.data;
};

export const updateBranchContact = async (branchId: string, contactId: string, payload: UpdateBranchContactPayload): Promise<BranchContact> => {
  const response = await apiClient.patch(`/branches/${branchId}/contacts/${contactId}`, payload);
  return response.data.data;
};

export const deleteBranchContact = async (branchId: string, contactId: string): Promise<void> => {
  await apiClient.delete(`/branches/${branchId}/contacts/${contactId}`);
};

export const promoteBranchContact = async (branchId: string, contactId: string): Promise<BranchContact> => {
  const response = await apiClient.post(`/branches/${branchId}/contacts/${contactId}/promote`);
  return response.data.data;
};
