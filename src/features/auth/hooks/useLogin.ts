import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, tokens, onboarding_completed }) => {
      setAuth(user, tokens, onboarding_completed);
      navigate(onboarding_completed ? '/dashboard' : '/onboarding', { replace: true });
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error);
    },
  });
};
