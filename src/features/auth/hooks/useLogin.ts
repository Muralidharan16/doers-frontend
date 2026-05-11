import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      navigate('/dashboard', { replace: true });
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};