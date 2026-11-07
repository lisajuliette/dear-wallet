import { create } from 'zustand';

import type { MilestoneId } from '@/features/rewards/milestonesCatalog';

type RewardQueueState = {
  pending: MilestoneId[];
  enqueue: (ids: MilestoneId[]) => void;
  peek: () => MilestoneId | null;
  shift: () => MilestoneId | null;
  clear: () => void;
};

/** In-memory queue so milestones play after the normal reward moment. */
export const useRewardQueueStore = create<RewardQueueState>((set, get) => ({
  pending: [],
  enqueue: (ids) => {
    if (ids.length === 0) return;
    set((s) => ({ pending: [...s.pending, ...ids] }));
  },
  peek: () => get().pending[0] ?? null,
  shift: () => {
    const [head, ...rest] = get().pending;
    set({ pending: rest });
    return head ?? null;
  },
  clear: () => set({ pending: [] }),
}));
