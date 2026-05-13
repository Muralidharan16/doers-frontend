import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      // Account not created yet — just email sent
      // Navigation handled in the component (pass email to check-inbox page)
    },
    onError: (error: any) => {
      console.error('Signup failed:', error);
    },
  });
};
