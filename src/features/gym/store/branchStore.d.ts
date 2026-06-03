import { type Gym } from '../services/gymApi';
interface BranchState {
    branches: Gym[];
    selectedBranch: Gym | null;
    isLoading: boolean;
    error: string | null;
    fetchBranches: () => Promise<Gym[]>;
    setSelectedBranch: (branch: Gym | null) => void;
    clearBranches: () => void;
}
export declare const useBranchStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<BranchState>, "setState" | "persist"> & {
    setState(partial: BranchState | Partial<BranchState> | ((state: BranchState) => BranchState | Partial<BranchState>), replace?: false | undefined): unknown;
    setState(state: BranchState | ((state: BranchState) => BranchState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<BranchState, BranchState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: BranchState) => void) => () => void;
        onFinishHydration: (fn: (state: BranchState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<BranchState, BranchState, unknown>>;
    };
}>;
export {};
