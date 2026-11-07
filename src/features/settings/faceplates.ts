import { formatCents } from '@/lib/money';
import { palettes, type PaletteKey, type Unlock } from '@/theme/theme';

export const PALETTE_ORDER: PaletteKey[] = [
  'cloud',
  'lilac',
  'peachfuzz',
  'peachsoda',
  'orchid',
  'midnight',
];

export type FaceplateStatus = {
  key: PaletteKey;
  name: string;
  locked: boolean;
  free: boolean;
  status: string;
  unlockLabel: string;
};

export type UnlockProgress = {
  keptTotalCents: number;
  keptLogCount: number;
  diaryTextCount: number;
};

export function isPaletteUnlocked(key: PaletteKey, unlockIds: string[]): boolean {
  const unlock = palettes[key].unlock;
  if (unlock === null) return true;
  return unlockIds.includes(`palette:${key}`);
}

export function unlockConditionLabel(unlock: Unlock): string {
  if (!unlock) return 'free';
  if (unlock.type === 'logs') return `at ${unlock.count} nvms`;
  if (unlock.type === 'diary_lines') return `at ${unlock.count} diary lines`;
  if (unlock.type === 'kept_total_cents') {
    return `at ${formatCents(unlock.amount)} kept`;
  }
  return 'locked';
}

export function remainingUnlockText(unlock: Unlock, progress: UnlockProgress): string | null {
  if (!unlock) return null;
  if (unlock.type === 'logs') {
    const left = Math.max(0, unlock.count - progress.keptLogCount);
    return left === 0 ? null : `${left} to go`;
  }
  if (unlock.type === 'diary_lines') {
    const left = Math.max(0, unlock.count - progress.diaryTextCount);
    return left === 0 ? null : `${left} to go`;
  }
  if (unlock.type === 'kept_total_cents') {
    const left = Math.max(0, unlock.amount - progress.keptTotalCents);
    return left === 0 ? null : `${formatCents(left)} to go`;
  }
  return null;
}

export function buildFaceplateStatuses(
  unlockIds: string[],
  activeKey: PaletteKey,
): FaceplateStatus[] {
  return PALETTE_ORDER.map((key) => {
    const meta = palettes[key];
    const free = meta.unlock === null;
    const unlocked = isPaletteUnlocked(key, unlockIds);
    const locked = !unlocked;
    let status = 'free';
    if (key === activeKey && unlocked) status = 'on';
    else if (locked) status = unlockConditionLabel(meta.unlock);
    else if (free) status = 'free';
    else status = 'unlocked';
    return {
      key,
      name: meta.name,
      locked,
      free,
      status,
      unlockLabel: unlockConditionLabel(meta.unlock),
    };
  });
}
