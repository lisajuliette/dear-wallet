import { buildCalendarDays } from '@/features/diary/buildCalendarDays';

describe('buildCalendarDays', () => {
  it('pads Monday-first and marks star, mood and today', () => {
    const at = new Date(2026, 10, 1); // Nov 2026 starts on Sunday → 6 pads
    const days = buildCalendarDays(
      at,
      [{ entryDate: '2026-11-06', mood: 'chill' }],
      [{ day: '2026-11-06' }, { day: '2026-11-07' }],
      new Date(2026, 10, 6),
    );

    expect(days[0]?.date.startsWith('pad-')).toBe(true);
    const sixth = days.find((d) => d.date === '2026-11-06');
    expect(sixth).toMatchObject({ mood: 'chill', star: true, today: true });
    expect(days.length).toBe(42);
  });
});
