import type { StickerId } from '@/components/stickerAssets';

export type AwardRow = { stickerId: string };
export type PlacedRow = { stickerId: string };

export type TrayCount = {
  id: StickerId;
  count: number;
  placed: boolean;
};

/**
 * Every owned sticker stays in the tray. Placements do not use it up.
 * `placed` is true when a copy is already on this page; the tile stays tappable.
 */
export function buildTrayCounts(
  awards: AwardRow[],
  _placedAll: PlacedRow[],
  placedOnPage: PlacedRow[],
): TrayCount[] {
  const owned = new Map<string, number>();
  for (const row of awards) {
    owned.set(row.stickerId, (owned.get(row.stickerId) ?? 0) + 1);
  }

  const onPage = new Set(placedOnPage.map((p) => p.stickerId));

  return [...owned.entries()]
    .map(([id, total]) => ({
      id: id as StickerId,
      count: total,
      placed: onPage.has(id),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
