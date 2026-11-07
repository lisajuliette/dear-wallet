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
    const seventh = days.find((d) => d.date === '2026-11-07');
    expect(sixth).toMatchObject({ mood: 'chill', star: false, today: true });
    expect(seventh).toMatchObject({ star: true, mood: null, future: true });
    expect(days.find((d) => d.date === '2026-11-08')).toMatchObject({
      future: true,
      selected: false,
    });
    expect(days.length).toBe(42);
  });

  it('marks the selected day and keeps a showed-up tile only when there is no mood', () => {
    const days = buildCalendarDays(
      new Date(2026, 10, 1),
      [{ entryDate: '2026-11-02', mood: null }],
      [{ day: '2026-11-02' }, { day: '2026-11-06' }],
      new Date(2026, 10, 7),
      '2026-11-02',
    );
    expect(days.find((d) => d.date === '2026-11-02')).toMatchObject({
      selected: true,
      star: true,
      mood: null,
    });
    expect(days.find((d) => d.date === '2026-11-06')?.selected).toBe(false);
  });
});
