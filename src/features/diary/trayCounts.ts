import type { StickerId } from '@/components/stickerAssets';

export type AwardRow = { stickerId: string };
export type PlacedRow = { stickerId: string };

export type TrayCount = {
  id: StickerId;
  count: number;
  placed: boolean;
};

/**
 * Owned awards minus placements (anywhere).
 * `placedOnPage` marks tiles that appear on the current page (dashed in the tray).
 */
export function buildTrayCounts(
  awards: AwardRow[],
  placedAll: PlacedRow[],
  placedOnPage: PlacedRow[],
): TrayCount[] {
  const owned = new Map<string, number>();
  for (const row of awards) {
    owned.set(row.stickerId, (owned.get(row.stickerId) ?? 0) + 1);
  }

  const used = new Map<string, number>();
  for (const row of placedAll) {
    used.set(row.stickerId, (used.get(row.stickerId) ?? 0) + 1);
  }

  const onPage = new Set(placedOnPage.map((p) => p.stickerId));

  return [...owned.entries()]
    .map(([id, total]) => {
      const remaining = Math.max(0, total - (used.get(id) ?? 0));
      return {
        id: id as StickerId,
        count: remaining,
        placed: onPage.has(id) || remaining <= 0,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
