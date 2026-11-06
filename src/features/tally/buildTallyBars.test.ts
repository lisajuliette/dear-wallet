import {
  buildTallyBars,
  sideTotalsLabel,
  tallyCaption,
  tallyListNote,
} from '@/features/tally/buildTallyBars';

function kept(happenedAt: string, cents: number) {
  return {
    kind: 'kept' as const,
    amountCents: cents,
    happenedAt,
    boughtAfterAllAt: null,
  };
}

describe('buildTallyBars', () => {
  it('returns no bars for day range', () => {
    const at = new Date(2026, 10, 6, 12);
    expect(buildTallyBars('day', [kept(at.toISOString(), 620)], at)).toEqual([]);
  });

  it('builds Mon–Sun week bars and ignores loved / bought-after-all', () => {
    // Week of Mon Nov 2 – Sun Nov 8, 2026
    const at = new Date(2026, 10, 6, 12);
    const bars = buildTallyBars(
      'week',
      [
        kept(new Date(2026, 10, 2, 10).toISOString(), 100), // Mon
        kept(new Date(2026, 10, 4, 10).toISOString(), 250), // Wed
        {
          kind: 'loved',
          amountCents: 9999,
          happenedAt: new Date(2026, 10, 4, 11).toISOString(),
          boughtAfterAllAt: null,
        },
        {
          kind: 'kept',
          amountCents: 500,
          happenedAt: new Date(2026, 10, 5, 10).toISOString(),
          boughtAfterAllAt: new Date().toISOString(),
        },
      ],
      at,
    );

    expect(bars.map((b) => b.label)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    expect(bars.map((b) => b.cents)).toEqual([100, 0, 250, 0, 0, 0, 0]);
  });

  it('builds month week buckets', () => {
    const at = new Date(2026, 10, 15);
    const bars = buildTallyBars(
      'month',
      [
        kept(new Date(2026, 10, 3, 10).toISOString(), 1000),
        kept(new Date(2026, 10, 10, 10).toISOString(), 2000),
        kept(new Date(2026, 10, 10, 12).toISOString(), 500),
      ],
      at,
    );

    expect(bars.length).toBeGreaterThanOrEqual(4);
    expect(bars.some((b) => b.cents === 1000)).toBe(true);
    expect(bars.some((b) => b.cents === 2500)).toBe(true);
  });
});

describe('tally captions', () => {
  it('uses empty, quiet and biggest-week copy', () => {
    expect(tallyCaption('week', [], 0)).toBe("nothing yet, and that's fine");
    expect(
      tallyCaption(
        'week',
        [
          { label: 'M', cents: 0 },
          { label: 'T', cents: 0 },
          { label: 'W', cents: 650 },
          { label: 'T', cents: 0 },
          { label: 'F', cents: 0 },
          { label: 'S', cents: 0 },
          { label: 'S', cents: 0 },
        ],
        650,
      ),
    ).toBe('a quiet week. still counts ♡');
    expect(
      tallyCaption(
        'month',
        [
          { label: 'wk 1', cents: 100 },
          { label: 'wk 2', cents: 900 },
          { label: 'wk 3', cents: 200 },
        ],
        1200,
      ),
    ).toBe('wk 2 was ur biggest week ✦');
  });

  it('builds side totals and list notes', () => {
    expect(sideTotalsLabel(0, 0)).toBe('tag any item to\nsee these');
    expect(sideTotalsLabel(12000, 6000)).toContain('savings');
    expect(tallyListNote('week', 0, 0)).toBe('ur kept things land here');
    expect(tallyListNote('week', 1, 650)).toBe('small week, still a win ♡');
  });
});
