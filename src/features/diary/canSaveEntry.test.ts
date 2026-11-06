import { canSaveEntry } from '@/features/diary/canSaveEntry';

describe('canSaveEntry', () => {
  it('needs a mood or at least one character', () => {
    expect(canSaveEntry(null, '')).toBe(false);
    expect(canSaveEntry(null, '   ')).toBe(false);
    expect(canSaveEntry(null, 'hi')).toBe(true);
    expect(canSaveEntry('chill', '')).toBe(true);
  });
});
