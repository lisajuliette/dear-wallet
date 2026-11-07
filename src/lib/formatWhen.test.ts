import { formatClock, formatShortDate } from '@/lib/formatWhen';

describe('formatWhen', () => {
  it('formats a short date without the year', () => {
    expect(formatShortDate(new Date(2026, 8, 12))).toBe('sept 12');
    expect(formatShortDate(new Date(2026, 10, 7))).toBe('nov 7');
  });

  it('formats a lowercase clock time', () => {
    expect(formatClock(new Date(2026, 10, 7, 15, 12))).toBe('3:12 pm');
    expect(formatClock(new Date(2026, 10, 7, 11, 40))).toBe('11:40 am');
    expect(formatClock(new Date(2026, 10, 7, 0, 5))).toBe('12:05 am');
  });
});
