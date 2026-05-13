import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/authApi';

export const useSignup = () => {
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      // Account not created yet — just email sent
      // Navigation handled in the component (pass email to check-inbox page)
    },
    onError: (error: unknown) => {
      console.error('Signup failed:', error);
    },
  });
};
