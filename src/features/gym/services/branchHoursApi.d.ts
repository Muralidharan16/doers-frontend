import type { OperatingHour, SpecialHour, SaveOperatingHoursPayload, SaveSpecialHoursPayload, BranchHoursProjection } from '../types/branchHours';
export declare const getBranchHours: (branchId: string) => Promise<OperatingHour[]>;
export declare const updateBranchHours: (branchId: string, payload: SaveOperatingHoursPayload) => Promise<OperatingHour[]>;
export declare const getBranchSpecialHours: (branchId: string) => Promise<SpecialHour[]>;
export declare const updateBranchSpecialHours: (branchId: string, payload: SaveSpecialHoursPayload) => Promise<SpecialHour[]>;
export declare const getOrgHours: () => Promise<OperatingHour[]>;
export declare const updateOrgHours: (payload: SaveOperatingHoursPayload) => Promise<OperatingHour[]>;
export declare const getBranchHoursProjection: (branchId: string) => Promise<BranchHoursProjection>;
