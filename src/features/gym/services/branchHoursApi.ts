import { apiClient } from '@/shared/services/api/client';
import type { 
  OperatingHour, 
  SpecialHour, 
  SaveOperatingHoursPayload, 
  SaveSpecialHoursPayload,
  BranchHoursProjection
} from '../types/branchHours';

// --- Branch Standard Hours ---

export const getBranchHours = async (branchId: string): Promise<OperatingHour[]> => {
  const response = await apiClient.get(`/branches/${branchId}/hours`);
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const updateBranchHours = async (branchId: string, payload: SaveOperatingHoursPayload): Promise<OperatingHour[]> => {
  const response = await apiClient.put(`/branches/${branchId}/hours`, payload);
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// --- Branch Special Hours ---

export const getBranchSpecialHours = async (branchId: string): Promise<SpecialHour[]> => {
  const response = await apiClient.get(`/branches/${branchId}/special-hours`);
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const updateBranchSpecialHours = async (branchId: string, payload: SaveSpecialHoursPayload): Promise<SpecialHour[]> => {
  const response = await apiClient.put(`/branches/${branchId}/special-hours`, payload);
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// --- Organization Default Hours ---

export const getOrgHours = async (): Promise<OperatingHour[]> => {
  const response = await apiClient.get('/organizations/hours');
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const updateOrgHours = async (payload: SaveOperatingHoursPayload): Promise<OperatingHour[]> => {
  const response = await apiClient.put('/organizations/hours', payload);
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// --- Projection ---

export const getBranchHoursProjection = async (branchId: string): Promise<BranchHoursProjection> => {
  const response = await apiClient.get(`/branches/${branchId}/hours/projection`);
  return response.data;
};
