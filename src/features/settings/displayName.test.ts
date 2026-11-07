import {
  FALLBACK_DISPLAY_NAME,
  isPlaceholderName,
  normalizeDisplayName,
} from '@/features/settings/displayName';

describe('display name', () => {
  it('falls back to You when the field is empty', () => {
    expect(normalizeDisplayName('   ')).toBe(FALLBACK_DISPLAY_NAME);
    expect(normalizeDisplayName(null)).toBe('You');
  });

  it('keeps a name the user typed', () => {
    expect(normalizeDisplayName('  mina  ')).toBe('mina');
    expect(isPlaceholderName('mina')).toBe(false);
    expect(isPlaceholderName('Jazmine')).toBe(true);
  });
});
