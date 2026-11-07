import { create } from 'zustand';

type AuthState = {
  ready: boolean;
  userId: string | null;
  isAnonymous: boolean;
  email: string | null;
  setSession: (input: {
    userId: string | null;
    isAnonymous: boolean;
    email: string | null;
  }) => void;
  setReady: (ready: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  ready: false,
  userId: null,
  isAnonymous: true,
  email: null,
  setSession: ({ userId, isAnonymous, email }) => set({ userId, isAnonymous, email }),
  setReady: (ready) => set({ ready }),
}));
