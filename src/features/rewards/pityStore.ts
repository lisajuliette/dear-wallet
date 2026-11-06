import { create } from 'zustand';

type PityState = {
  emptyStreak: number;
  setEmptyStreak: (n: number) => void;
};

/** Local pity counter for sticker drops (resets on drop). Sync later if needed. */
export const usePityStore = create<PityState>((set) => ({
  emptyStreak: 0,
  setEmptyStreak: (emptyStreak) => set({ emptyStreak }),
}));
