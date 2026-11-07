import { parseTallyRange } from '@/features/tally/persistRange';

describe('parseTallyRange', () => {
  it('keeps a stored day, week, or month', () => {
    expect(parseTallyRange('day')).toBe('day');
    expect(parseTallyRange('week')).toBe('week');
    expect(parseTallyRange('month')).toBe('month');
  });

  it('falls back to month', () => {
    expect(parseTallyRange(null)).toBe('month');
    expect(parseTallyRange('year')).toBe('month');
  });
});
