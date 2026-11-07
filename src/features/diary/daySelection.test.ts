import { isFutureDay, selectDay } from '@/features/diary/daySelection';

describe('selectDay', () => {
  const today = '2026-11-07';

  it('selects a day and never navigates', () => {
    expect(selectDay('2026-11-05', today)).toEqual({
      date: '2026-11-05',
      selected: true,
      navigate: false,
    });
  });

  it('leaves future days unselected', () => {
    expect(selectDay('2026-11-08', today)).toEqual({
      date: '2026-11-08',
      selected: false,
      navigate: false,
    });
    expect(isFutureDay('2026-11-08', today)).toBe(true);
    expect(isFutureDay('2026-11-07', today)).toBe(false);
  });
});
