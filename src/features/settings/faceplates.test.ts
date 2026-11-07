import {
  buildFaceplateStatuses,
  isPaletteUnlocked,
  remainingUnlockText,
  unlockConditionLabel,
} from '@/features/settings/faceplates';

describe('faceplates', () => {
  it('treats free palettes as unlocked without unlock ids', () => {
    expect(isPaletteUnlocked('cloud', [])).toBe(true);
    expect(isPaletteUnlocked('midnight', [])).toBe(false);
    expect(isPaletteUnlocked('midnight', ['palette:midnight'])).toBe(true);
  });

  it('builds statuses with on / free / locked labels', () => {
    const plates = buildFaceplateStatuses(['palette:midnight'], 'cloud');
    expect(plates.find((p) => p.key === 'cloud')?.status).toBe('on');
    expect(plates.find((p) => p.key === 'lilac')?.status).toBe('free');
    expect(plates.find((p) => p.key === 'midnight')?.locked).toBe(false);
    expect(plates.find((p) => p.key === 'orchid')?.locked).toBe(true);
  });

  it('formats unlock remaining text for try-on bar', () => {
    expect(unlockConditionLabel({ type: 'kept_total_cents', amount: 100_000 })).toBe(
      'at $1000.00 kept',
    );
    expect(
      remainingUnlockText(
        { type: 'kept_total_cents', amount: 100_000 },
        { keptTotalCents: 52_550, keptLogCount: 0, diaryTextCount: 0 },
      ),
    ).toBe('$474.50 to go');
  });
});
