import { create } from 'zustand';

export type TrialLockCode = 'SOFT_LOCKED' | 'HARD_LOCKED';

interface TrialLockState {
  code: TrialLockCode | null;
  message: string | null;
  setLock: (code: TrialLockCode, message: string) => void;
  clearLock: () => void;
}

export const useTrialLockStore = create<TrialLockState>((set) => ({
  code: null,
  message: null,
  setLock: (code, message) => set({ code, message }),
  clearLock: () => set({ code: null, message: null }),
}));
