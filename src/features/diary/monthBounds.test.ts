import {
  canGoNext,
  canGoPrev,
  dayAfterMonthChange,
  earliestMonth,
  showTodayChip,
} from '@/features/diary/monthBounds';

describe('month bounds', () => {
  const today = new Date(2026, 10, 7);

  it('stops at the first month that has a log or a page', () => {
    const earliest = earliestMonth(['2026-11-02T12:00:00.000Z', '2026-10-19', null]);
    expect(earliest).toBe('2026-10');
    expect(canGoPrev(new Date(2026, 10, 1), earliest)).toBe(true);
    expect(canGoPrev(new Date(2026, 9, 1), earliest)).toBe(false);
    expect(canGoPrev(new Date(2026, 10, 1), null)).toBe(false);
  });

  it('disables next on the current month and shows today on any other month', () => {
    expect(canGoNext(new Date(2026, 10, 1), today)).toBe(false);
    expect(canGoNext(new Date(2026, 9, 1), today)).toBe(true);
    expect(showTodayChip(new Date(2026, 10, 1), today)).toBe(false);
    expect(showTodayChip(new Date(2026, 9, 1), today)).toBe(true);
  });

  it('clamps the selected day and will not land in the future', () => {
    expect(dayAfterMonthChange(new Date(2026, 9, 1), 31, today)).toBe('2026-10-31');
    expect(dayAfterMonthChange(new Date(2026, 1, 1), 31, new Date(2026, 10, 7))).toBe('2026-02-28');
    expect(dayAfterMonthChange(new Date(2026, 10, 1), 20, today)).toBe('2026-11-07');
  });
});
