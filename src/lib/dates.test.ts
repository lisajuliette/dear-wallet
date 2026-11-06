import { dayKey, dayRange, monthRange, parseDayKey, weekRange } from './dates';

describe('dayKey', () => {
  it('formats local YYYY-MM-DD', () => {
    expect(dayKey(new Date(2026, 10, 6))).toBe('2026-11-06');
  });

  it('round-trips with parseDayKey', () => {
    const key = '2026-02-01';
    expect(dayKey(parseDayKey(key))).toBe(key);
  });
});

describe('weekRange', () => {
  it('starts on Monday and ends on Sunday', () => {
    // Friday 6 Nov 2026
    const { start, end } = weekRange(new Date(2026, 10, 6));
    expect(dayKey(start)).toBe('2026-11-02');
    expect(dayKey(end)).toBe('2026-11-08');
    expect(start.getDay()).toBe(1);
    expect(end.getDay()).toBe(0);
  });

  it('keeps Sunday inside the week that started the previous Monday', () => {
    const { start, end } = weekRange(new Date(2026, 10, 8));
    expect(dayKey(start)).toBe('2026-11-02');
    expect(dayKey(end)).toBe('2026-11-08');
  });

  it('starts a new week on Monday', () => {
    const { start, end } = weekRange(new Date(2026, 10, 9));
    expect(dayKey(start)).toBe('2026-11-09');
    expect(dayKey(end)).toBe('2026-11-15');
  });
});

describe('monthRange', () => {
  it('covers the full calendar month', () => {
    const { start, end } = monthRange(new Date(2026, 10, 6));
    expect(dayKey(start)).toBe('2026-11-01');
    expect(dayKey(end)).toBe('2026-11-30');
  });

  it('handles February in a leap year', () => {
    const { start, end } = monthRange(new Date(2024, 1, 10));
    expect(dayKey(start)).toBe('2024-02-01');
    expect(dayKey(end)).toBe('2024-02-29');
  });

  it('handles month ends that roll into the next year', () => {
    const { start, end } = monthRange(new Date(2026, 11, 31));
    expect(dayKey(start)).toBe('2026-12-01');
    expect(dayKey(end)).toBe('2026-12-31');
  });
});

describe('dayRange', () => {
  it('starts at local midnight and ends at end of day', () => {
    const { start, end } = dayRange(new Date(2026, 10, 6, 15, 30));
    expect(start.getHours()).toBe(0);
    expect(end.getHours()).toBe(23);
    expect(dayKey(start)).toBe('2026-11-06');
    expect(dayKey(end)).toBe('2026-11-06');
  });
});
