import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getBranchHours, 
  updateBranchHours, 
  getBranchSpecialHours, 
  updateBranchSpecialHours, 
  getOrgHours, 
  updateOrgHours,
  getBranchHoursProjection
} from '../services/branchHoursApi';
import type { 
  SaveOperatingHoursPayload, 
  SaveSpecialHoursPayload 
} from '../types/branchHours';

export const branchHoursKeys = {
  all: ['branchHours'] as const,
  branch: (branchId: string) => [...branchHoursKeys.all, 'standard', branchId] as const,
  special: (branchId: string) => [...branchHoursKeys.all, 'special', branchId] as const,
  projection: (branchId: string) => [...branchHoursKeys.all, 'projection', branchId] as const,
  orgDefault: () => [...branchHoursKeys.all, 'org'] as const,
};

// --- Standard Hours ---

export const useBranchHours = (branchId: string) => {
  return useQuery({
    queryKey: branchHoursKeys.branch(branchId),
    queryFn: () => getBranchHours(branchId),
    enabled: !!branchId,
  });
};

export const useUpdateBranchHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ branchId, payload }: { branchId: string; payload: SaveOperatingHoursPayload }) => 
      updateBranchHours(branchId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchHoursKeys.branch(variables.branchId) });
      queryClient.invalidateQueries({ queryKey: branchHoursKeys.projection(variables.branchId) });
    },
  });
};

// --- Special Hours ---

export const useBranchSpecialHours = (branchId: string) => {
  return useQuery({
    queryKey: branchHoursKeys.special(branchId),
    queryFn: () => getBranchSpecialHours(branchId),
    enabled: !!branchId,
  });
};

export const useUpdateBranchSpecialHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ branchId, payload }: { branchId: string; payload: SaveSpecialHoursPayload }) => 
      updateBranchSpecialHours(branchId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: branchHoursKeys.special(variables.branchId) });
      queryClient.invalidateQueries({ queryKey: branchHoursKeys.projection(variables.branchId) });
    },
  });
};

// --- Org Default Hours ---

export const useOrgHours = () => {
  return useQuery({
    queryKey: branchHoursKeys.orgDefault(),
    queryFn: () => getOrgHours(),
  });
};

export const useUpdateOrgHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveOperatingHoursPayload) => updateOrgHours(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchHoursKeys.orgDefault() });
      queryClient.invalidateQueries({ queryKey: branchHoursKeys.all }); // Invalidates all standard and projection hours for all branches to ensure changes propagate
    },
  });
};

// --- Projection ---

export const useBranchHoursProjection = (branchId: string) => {
  return useQuery({
    queryKey: branchHoursKeys.projection(branchId),
    queryFn: () => getBranchHoursProjection(branchId),
    enabled: !!branchId,
    retry: false, // Don't retry on 404 (not configured)
  });
};
