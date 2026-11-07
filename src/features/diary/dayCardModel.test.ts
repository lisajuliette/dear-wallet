import {
  buildDayCard,
  dayCountLabel,
  keptTotalCents,
  type DayLog,
} from '@/features/diary/dayCardModel';

const kept = (patch: Partial<DayLog> = {}): DayLog => ({
  id: 'kept',
  name: 'bubble tea',
  kind: 'kept',
  amountCents: 650,
  category: 'treats',
  boughtAfterAll: false,
  ...patch,
});

describe('day totals', () => {
  it('drops bought-after-all items and never adds loved prices', () => {
    const items: DayLog[] = [
      kept(),
      kept({ id: 'gloss', name: 'gloss', amountCents: 1750, category: 'clothes' }),
      kept({ id: 'loved', name: 'picnic', kind: 'loved', amountCents: 4000, category: null }),
      kept({ id: 'bought', name: 'sneakers', amountCents: 8900, boughtAfterAll: true }),
    ];
    expect(keptTotalCents(items)).toBe(2400);
    expect(dayCountLabel(items)).toBe('2 nvms · 1 loved');
  });

  it('uses the singular nvm and hides an empty chip', () => {
    expect(dayCountLabel([kept({ amountCents: 6400 })])).toBe('1 nvm');
    expect(dayCountLabel([kept({ boughtAfterAll: true })])).toBe('');
  });
});

describe('buildDayCard', () => {
  it('shows a star chip only when that day earned one', () => {
    const withStar = buildDayCard({
      date: '2026-11-06',
      todayKey: '2026-11-07',
      items: [kept()],
      page: null,
      hasStar: true,
    });
    const without = buildDayCard({
      date: '2026-11-04',
      todayKey: '2026-11-07',
      items: [],
      page: null,
      hasStar: false,
    });
    expect(withStar.showStarChip).toBe(true);
    expect(withStar.label).toBe('FRI 6 NOV');
    expect(without.showStarChip).toBe(false);
  });

  it('uses today copy and the primary write button when nothing is logged', () => {
    const card = buildDayCard({
      date: '2026-11-07',
      todayKey: '2026-11-07',
      items: [],
      page: null,
      hasStar: false,
    });
    expect(card.quiet).toEqual({
      title: "nothing logged today, and that's fine",
      sub: 'one line or just a mood counts',
    });
    expect(card.cta).toEqual({ kind: 'primary', label: "write today's page" });
  });

  it('uses the quiet past-day copy and offers a page for that day', () => {
    const card = buildDayCard({
      date: '2026-11-04',
      todayKey: '2026-11-07',
      items: [kept({ boughtAfterAll: true })],
      page: null,
      hasStar: false,
    });
    expect(card.quiet?.title).toBe("a quiet day. that's allowed ♡");
    expect(card.quiet?.sub).toBe('no nvms and no page on this day');
    expect(card.cta).toEqual({ kind: 'primary', label: "write today's page" });
    expect(card.rows).toHaveLength(0);
  });

  it('opens an existing page instead of writing a new one', () => {
    const today = buildDayCard({
      date: '2026-11-07',
      todayKey: '2026-11-07',
      items: [kept()],
      page: { id: 'page', mood: 'chill', body: 'hi' },
      hasStar: true,
    });
    const past = buildDayCard({
      date: '2026-10-19',
      todayKey: '2026-11-07',
      items: [],
      page: { id: 'old', mood: 'proud', body: 'kept walking' },
      hasStar: true,
    });
    expect(today.cta.label).toBe("open today's page");
    expect(past.cta.label).toBe('open this page');
    expect(past.page?.line).toBe('kept walking');
  });
});
