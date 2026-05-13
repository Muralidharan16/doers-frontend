import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  setAuth: (user: User, tokens: AuthTokens, onboardingCompleted: boolean) => void;
  startCookieSession: (onboardingCompleted?: boolean) => void;
  clearAuth: () => void;
  completeOnboarding: () => void;
  updateTokens: (tokens: AuthTokens, onboardingCompleted?: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      setAuth: (user, tokens, onboardingCompleted) => set({
        user,
        tokens,
        isAuthenticated: true,
        onboardingCompleted,
      }),
      startCookieSession: (onboardingCompleted = false) => set({
        isAuthenticated: true,
        onboardingCompleted,
      }),
      clearAuth: () => set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        onboardingCompleted: false,
      }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      updateTokens: (tokens, onboardingCompleted) => set((state) => ({
        tokens,
        onboardingCompleted: onboardingCompleted ?? state.onboardingCompleted,
      })),
    }),
    { name: 'auth-storage' }
  )
);
