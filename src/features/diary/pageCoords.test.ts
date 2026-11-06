import {
  clampStickerScale,
  decoratePageHeight,
  fractionToPixels,
  pixelsToFraction,
} from '@/features/diary/pageCoords';

describe('pageCoords', () => {
  it('round-trips fractions and pixels on a phone page', () => {
    const page = { width: 358, height: 520 };
    const px = fractionToPixels({ x: 0.25, y: 0.5 }, page);
    expect(px).toEqual({ x: 89.5, y: 260 });
    expect(pixelsToFraction(px, page)).toEqual({ x: 0.25, y: 0.5 });
  });

  it('round-trips on a compact SE-sized page', () => {
    const page = { width: 343, height: decoratePageHeight(667, true) };
    const frac = { x: 0.8, y: 0.2 };
    const back = pixelsToFraction(fractionToPixels(frac, page), page);
    expect(back.x).toBeCloseTo(0.8, 5);
    expect(back.y).toBeCloseTo(0.2, 5);
  });

  it('clamps sticker scale to 0.4–2.5', () => {
    expect(clampStickerScale(0.1)).toBe(0.4);
    expect(clampStickerScale(3)).toBe(2.5);
    expect(clampStickerScale(1.2)).toBe(1.2);
  });
});
