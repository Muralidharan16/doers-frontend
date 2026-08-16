import { create } from 'zustand';
import type { User } from '../types';

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export const LEGACY_AUTH_STORAGE_KEY = 'auth-storage';
export const LEGACY_SIGNUP_POLL_STORAGE_KEY = 'signup-poll-token';
export const AUTH_EVENT_STORAGE_KEY = 'doers-auth-event';

export const purgeLegacyAuthStorage = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(LEGACY_SIGNUP_POLL_STORAGE_KEY);
  }
};

export const broadcastSignedOut = (): void => {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({ type: 'logout', at: Date.now() });
  window.localStorage.setItem(AUTH_EVENT_STORAGE_KEY, payload);
  window.localStorage.removeItem(AUTH_EVENT_STORAGE_KEY);
};

export const isSignedOutStorageEvent = (event: StorageEvent): boolean => {
  if (event.key !== AUTH_EVENT_STORAGE_KEY || !event.newValue) return false;
  try {
    return (JSON.parse(event.newValue) as { type?: string }).type === 'logout';
  } catch {
    return false;
  }
};

purgeLegacyAuthStorage();

interface AuthState {
  status: AuthStatus;
  user: User | null;
  onboardingCompleted: boolean;
  setSession: (user: User, onboardingCompleted: boolean) => void;
  clearAuth: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'unknown',
  user: null,
  onboardingCompleted: false,
  setSession: (user, onboardingCompleted) => set({
    status: 'authenticated',
    user,
    onboardingCompleted,
  }),
  clearAuth: () => set({
    status: 'unauthenticated',
    user: null,
    onboardingCompleted: false,
  }),
  completeOnboarding: () => set({ onboardingCompleted: true }),
}));
