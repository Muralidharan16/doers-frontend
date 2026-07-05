import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gymApi, type Gym } from '../services/gymApi';

interface BranchState {
  branches: Gym[];
  selectedBranch: Gym | null;
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => Promise<Gym[]>;
  setSelectedBranch: (branch: Gym | null) => void;
  clearBranches: () => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      branches: [],
      selectedBranch: null,
      isLoading: false,
      error: null,
      fetchBranches: async () => {
        set({ isLoading: true, error: null });
        try {
          const branches = await gymApi.getGyms();
          const activeBranches = branches.filter(b => b.is_active);
          const currentSelected = get().selectedBranch;
          
          // Verify if currently selected branch still exists in the active list
          const stillExists = currentSelected ? activeBranches.some(b => b.id === currentSelected.id) : false;
          
          let nextSelected = currentSelected;
          if (!stillExists) {
            nextSelected = activeBranches.length > 0 ? activeBranches[0] : null;
          } else {
            // update selected branch details in case they changed
            nextSelected = activeBranches.find(b => b.id === currentSelected?.id) || null;
          }

          set({ 
            branches: activeBranches, 
            selectedBranch: nextSelected, 
            isLoading: false 
          });
          return activeBranches;
        } catch (err: any) {
          const errorMsg = err?.response?.data?.detail?.message || err?.message || 'Failed to fetch branches';
          set({ isLoading: false, error: errorMsg });
          throw err;
        }
      },
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      clearBranches: () => set({ branches: [], selectedBranch: null, error: null }),
    }),
    {
      name: 'branch-storage',
    }
  )
);
