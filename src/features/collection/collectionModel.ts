import { STICKER_ASSETS, type StickerId } from '@/components/stickerAssets';
import {
  MILESTONES,
  type MilestoneDef,
  type MilestoneStats,
} from '@/features/rewards/milestonesCatalog';
import { ALBUM_SLOT_COUNT, allAlbumStickerIds, PACKS, type PackId } from '@/features/rewards/packs';

export type BadgeState = 'done' | 'next' | 'locked';

export type MilestoneBadge = {
  id: string;
  label: string;
  state: BadgeState;
  pct: string;
};

export type AlbumSlot = {
  id: string;
  owned: boolean;
  hasArt: boolean;
};

export type PackCard = {
  id: PackId;
  label: string;
  locked: boolean;
  unlockHint: string;
  progress: number;
  remainingLabel: string;
  silhouetteCount: number;
};

function thresholdProgress(def: MilestoneDef, stats: MilestoneStats): number {
  switch (def.id) {
    case 'first_nvm':
      return stats.keptLogCount >= 1 ? 1 : 0;
    case 'kept_100':
      return Math.min(1, stats.keptTotalCents / 10_000);
    case 'kept_250':
      return Math.min(1, stats.keptTotalCents / 25_000);
    case 'kept_500':
      return Math.min(1, stats.keptTotalCents / 50_000);
    case 'kept_1000':
      return Math.min(1, stats.keptTotalCents / 100_000);
    case 'logs_50':
      return Math.min(1, stats.keptLogCount / 50);
    case 'logs_100':
      return Math.min(1, stats.keptLogCount / 100);
    case 'diary_10':
      return Math.min(1, stats.diaryTextCount / 10);
    case 'diary_30':
      return Math.min(1, stats.diaryTextCount / 30);
    default:
      return 0;
  }
}

function shortLabel(def: MilestoneDef): string {
  if (def.unit === 'KEPT') return def.big;
  if (def.id.startsWith('diary')) return `${def.big} lines`;
  return `${def.big} nvms`;
}

/** Four badges for Collection: done + next + locked fillers. */
export function buildMilestoneBadges(
  achieved: Set<string>,
  stats: MilestoneStats,
): MilestoneBadge[] {
  const badges: MilestoneBadge[] = [];
  const done = MILESTONES.filter((m) => achieved.has(m.id));
  for (const m of done.slice(-3)) {
    badges.push({ id: m.id, label: shortLabel(m), state: 'done', pct: '100%' });
  }
  const next = MILESTONES.find((m) => !achieved.has(m.id));
  if (next) {
    const p = thresholdProgress(next, stats);
    badges.push({
      id: next.id,
      label: shortLabel(next),
      state: 'next',
      pct: `${Math.round(p * 100)}%`,
    });
  }
  while (badges.length < 4) {
    const locked = MILESTONES.find(
      (m) => !achieved.has(m.id) && !badges.some((b) => b.id === m.id),
    );
    if (!locked) break;
    badges.push({ id: locked.id, label: shortLabel(locked), state: 'locked', pct: '' });
  }
  return badges.slice(0, 4);
}

export function buildAlbumSlots(ownedIds: Iterable<string>): AlbumSlot[] {
  const owned = new Set(ownedIds);
  return allAlbumStickerIds().map((id) => ({
    id,
    owned: owned.has(id),
    hasArt: id in STICKER_ASSETS,
  }));
}

export function albumOwnedCount(slots: AlbumSlot[]): number {
  return slots.filter((s) => s.owned).length;
}

export { ALBUM_SLOT_COUNT };

function remainingForPack(
  packId: PackId,
  stats: MilestoneStats,
): { progress: number; label: string } {
  if (packId === 'y2k_desk') {
    const rem = Math.max(0, 50_000 - stats.keptTotalCents);
    return {
      progress: Math.min(1, stats.keptTotalCents / 50_000),
      label: rem === 0 ? 'ready ♡' : `$${(rem / 100).toFixed(2)} to go ♡`,
    };
  }
  if (packId === 'holo_club') {
    const rem = Math.max(0, 50 - stats.keptLogCount);
    return {
      progress: Math.min(1, stats.keptLogCount / 50),
      label: rem === 0 ? 'ready ♡' : `${rem} logs to go ♡`,
    };
  }
  return { progress: 1, label: '' };
}

export function buildPackCards(unlockIds: Iterable<string>, stats: MilestoneStats): PackCard[] {
  const unlocked = new Set(unlockIds);
  return (Object.keys(PACKS) as PackId[]).map((id) => {
    const pack = PACKS[id];
    const locked = id !== 'starter' && !unlocked.has(`pack:${id}`);
    const rem = remainingForPack(id, stats);
    return {
      id,
      label: pack.label,
      locked,
      unlockHint: pack.unlockHint,
      progress: rem.progress,
      remainingLabel: rem.label,
      silhouetteCount: pack.stickerIds.length,
    };
  });
}

export function isStickerId(id: string): id is StickerId {
  return id in STICKER_ASSETS;
}
