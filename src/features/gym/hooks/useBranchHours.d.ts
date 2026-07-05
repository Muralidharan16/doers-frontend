import type { SaveOperatingHoursPayload, SaveSpecialHoursPayload } from '../types/branchHours';
export declare const branchHoursKeys: {
    all: readonly ["branchHours"];
    branch: (branchId: string) => readonly ["branchHours", "standard", string];
    special: (branchId: string) => readonly ["branchHours", "special", string];
    projection: (branchId: string) => readonly ["branchHours", "projection", string];
    orgDefault: () => readonly ["branchHours", "org"];
};
export declare const useBranchHours: (branchId: string) => import("@tanstack/react-query").UseQueryResult<import("../types").OperatingHour[], Error>;
export declare const useUpdateBranchHours: () => import("@tanstack/react-query").UseMutationResult<import("../types").OperatingHour[], Error, {
    branchId: string;
    payload: SaveOperatingHoursPayload;
}, unknown>;
export declare const useBranchSpecialHours: (branchId: string) => import("@tanstack/react-query").UseQueryResult<import("../types").SpecialHour[], Error>;
export declare const useUpdateBranchSpecialHours: () => import("@tanstack/react-query").UseMutationResult<import("../types").SpecialHour[], Error, {
    branchId: string;
    payload: SaveSpecialHoursPayload;
}, unknown>;
export declare const useOrgHours: () => import("@tanstack/react-query").UseQueryResult<import("../types").OperatingHour[], Error>;
export declare const useUpdateOrgHours: () => import("@tanstack/react-query").UseMutationResult<import("../types").OperatingHour[], Error, SaveOperatingHoursPayload, unknown>;
export declare const useBranchHoursProjection: (branchId: string) => import("@tanstack/react-query").UseQueryResult<import("../types").BranchHoursProjection, Error>;
