import type { StickerId } from '@/components/stickerAssets';

export const STARTER_COMMON: StickerId[] = [
  'common-butterfly',
  'common-dear-wallet-letter',
  'common-flip-phone',
  'common-gold-star',
  'common-kept-stack',
  'common-lil-cloud',
  'common-lip-gloss',
  'common-mixtape',
  'common-nvm-bubble',
  'common-nvmd-boba',
  'common-pixel-heart',
  'common-sparkle-trio',
];

export const STARTER_RARE: StickerId[] = ['rare-holo-butterfly', 'rare-holo-cd', 'rare-holo-star'];

export type PackId = 'starter' | 'y2k_desk' | 'holo_club';

export type PackDef = {
  id: PackId;
  label: string;
  /** Collectible sticker ids in this pack (placeholders have no SVG yet). */
  stickerIds: string[];
  /** Only stickers with real assets enter the drop pool. */
  dropCommon: StickerId[];
  dropRare: StickerId[];
  unlockMilestoneId: string | null;
  unlockHint: string;
};

/** Placeholder desk stickers — art still to draw (BUILD_SPEC §11). */
export const Y2K_DESK_IDS = [
  'desk-sticky-note',
  'desk-gel-pen',
  'desk-cd-stack',
  'desk-mini-calendar',
  'desk-usb-kitty',
  'desk-tape-dispenser',
] as const;

/** Placeholder holo club rares — art still to draw. */
export const HOLO_CLUB_IDS = ['holo-club-star', 'holo-club-heart', 'holo-club-disc'] as const;

export const PACKS: Record<PackId, PackDef> = {
  starter: {
    id: 'starter',
    label: 'starter',
    stickerIds: [...STARTER_COMMON, ...STARTER_RARE],
    dropCommon: STARTER_COMMON,
    dropRare: STARTER_RARE,
    unlockMilestoneId: null,
    unlockHint: 'available from day one',
  },
  y2k_desk: {
    id: 'y2k_desk',
    label: 'y2k desk',
    stickerIds: [...Y2K_DESK_IDS],
    dropCommon: [],
    dropRare: [],
    unlockMilestoneId: 'kept_500',
    unlockHint: 'it opens on its own when ur kept total hits $500',
  },
  holo_club: {
    id: 'holo_club',
    label: 'holo club',
    stickerIds: [...HOLO_CLUB_IDS],
    dropCommon: [],
    dropRare: [],
    unlockMilestoneId: 'logs_50',
    unlockHint: 'it opens on its own at 50 logs',
  },
};

export const ALBUM_SLOT_COUNT = 24;

export function unlockIdForPack(packId: PackId): string {
  return `pack:${packId}`;
}

/** Commons/rares available to roll given unlock rows. Starter always included. */
export function dropPoolsForUnlocks(unlockIds: Iterable<string>): {
  commons: StickerId[];
  rares: StickerId[];
} {
  const unlocked = new Set(unlockIds);
  const commons: StickerId[] = [...PACKS.starter.dropCommon];
  const rares: StickerId[] = [...PACKS.starter.dropRare];

  for (const pack of [PACKS.y2k_desk, PACKS.holo_club]) {
    if (!unlocked.has(unlockIdForPack(pack.id))) continue;
    commons.push(...pack.dropCommon);
    rares.push(...pack.dropRare);
  }

  return { commons, rares };
}

export function allAlbumStickerIds(): string[] {
  return [...PACKS.starter.stickerIds, ...PACKS.y2k_desk.stickerIds, ...PACKS.holo_club.stickerIds];
}
