export type PageSize = {
  width: number;
  height: number;
};

export type Point = { x: number; y: number };

/** Convert page-fraction coords (0–1) to pixels for a diary page. */
export function fractionToPixels(point: Point, page: PageSize): Point {
  return {
    x: point.x * page.width,
    y: point.y * page.height,
  };
}

/** Convert pixel coords to page fractions so stickers restore across sizes. */
export function pixelsToFraction(point: Point, page: PageSize): Point {
  return {
    x: page.width === 0 ? 0 : point.x / page.width,
    y: page.height === 0 ? 0 : point.y / page.height,
  };
}

/** Clamp sticker scale to the decorate range. */
export function clampStickerScale(scale: number): number {
  return Math.min(2.5, Math.max(0.4, scale));
}

/** Compact decorate page height from canvas notes (screen − header − tray − hint). */
export function decoratePageHeight(screenHeight: number, compact: boolean): number {
  const header = compact ? 56 : 64;
  const tray = compact ? 150 : 168;
  const hint = 36;
  const padding = 24;
  return Math.max(220, screenHeight - header - tray - hint - padding);
}
