import { buildRecap, type RecapItemInput } from '@/features/recap/buildRecap';

const at = new Date(2026, 10, 15); // Nov 2026

function item(
  partial: Partial<RecapItemInput> & Pick<RecapItemInput, 'id' | 'name' | 'kind'>,
): RecapItemInput {
  return {
    amountCents: 1000,
    happenedAt: '2026-11-10T12:00:00.000Z',
    ...partial,
  };
}

describe('buildRecap', () => {
  it('builds a big month wanted with top 10 and +N more', () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      item({
        id: `k-${i}`,
        name: `thing ${i}`,
        kind: 'kept',
        amountCents: (12 - i) * 100,
      }),
    );
    const data = buildRecap({ period: 'month', kind: 'wanted', at, items });
    expect(data.quiet).toBe(false);
    expect(data.empty).toBe(false);
    expect(data.tracks).toHaveLength(10);
    expect(data.moreCount).toBe(2);
    expect(data.moreLine).toBe('+ 2 more tiny wins');
    expect(data.tracks[0]?.right).toMatch(/^\$/);
    expect(data.coverTag).toBe('A DEAR WALLET MIXTAPE');
    expect(data.title).toBe("wanted but didn't");
  });

  it('marks quiet months with ≤2 items', () => {
    const data = buildRecap({
      period: 'month',
      kind: 'wanted',
      at,
      items: [
        item({ id: 'a', name: 'tea', kind: 'kept', amountCents: 500 }),
        item({ id: 'b', name: 'gum', kind: 'kept', amountCents: 200 }),
      ],
    });
    expect(data.quiet).toBe(true);
    expect(data.tracks).toHaveLength(2);
    expect(data.moreLine).toBe('a quiet month is still a hit ♡');
  });

  it('handles empty periods', () => {
    const data = buildRecap({ period: 'week', kind: 'wanted', at, items: [] });
    expect(data.empty).toBe(true);
    expect(data.tracks).toHaveLength(0);
    expect(data.totalCents).toBe(0);
  });

  it('never includes prices on loved tracks', () => {
    const data = buildRecap({
      period: 'month',
      kind: 'loved',
      at,
      items: [
        item({
          id: 'l1',
          name: 'concert',
          kind: 'loved',
          amountCents: 8900,
          happenedAt: '2026-11-08T18:00:00.000Z',
        }),
      ],
    });
    expect(data.coverTag).toBe('THE LOVED EDITION');
    expect(data.totalChip).toBe('1 LOVED');
    expect(data.tracks[0]?.right).not.toMatch(/\$/);
    expect(data.tracks[0]?.right.toLowerCase()).toMatch(/nov|11/);
  });

  it('excludes bought-after-all from wanted', () => {
    const data = buildRecap({
      period: 'month',
      kind: 'wanted',
      at,
      items: [
        item({ id: 'a', name: 'kept', kind: 'kept', amountCents: 1000 }),
        item({
          id: 'b',
          name: 'bought',
          kind: 'kept',
          amountCents: 5000,
          boughtAfterAllAt: '2026-11-11T00:00:00.000Z',
        }),
      ],
    });
    expect(data.tracks).toHaveLength(1);
    expect(data.totalCents).toBe(1000);
  });
});
