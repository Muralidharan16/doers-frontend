import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { useBranchStore } from '@/features/gym';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, onboarding_completed }) => {
      useBranchStore.getState().clearBranches();
      window.localStorage.removeItem('branch-storage');
      queryClient.clear();
      setSession(user, onboarding_completed);
      navigate(onboarding_completed ? '/dashboard' : '/onboarding', { replace: true });
    },
  });
};
