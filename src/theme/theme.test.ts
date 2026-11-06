import { cloudPath, paletteVars, palettes, tokens, type PaletteKey, type TokenName } from './theme';

jest.mock('nativewind', () => ({
  vars: (value: Record<string, string>) => value,
}));

const TOKEN_NAMES: TokenName[] = [
  'bg1',
  'bg2',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
  'surface',
  'outline',
  'text',
  'btn',
  'btnText',
];

const PALETTE_KEYS = Object.keys(palettes) as PaletteKey[];

describe('theme palettes', () => {
  it('includes every expected palette key', () => {
    expect(PALETTE_KEYS.sort()).toEqual(
      ['cloud', 'lilac', 'midnight', 'orchid', 'peachfuzz', 'peachsoda'].sort(),
    );
  });

  it.each(PALETTE_KEYS)('%s has every token color', (key) => {
    for (const name of TOKEN_NAMES) {
      expect(palettes[key].colors[name]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('paletteVars', () => {
  it.each(PALETTE_KEYS)('%s returns RGB channel strings for every token', (key) => {
    const vars = paletteVars(key) as unknown as Record<string, string>;

    for (const name of TOKEN_NAMES) {
      expect(vars[`--${name}`]).toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/);
    }
  });
});

describe('tokens', () => {
  it('adds derived rgba values', () => {
    const t = tokens('cloud');
    expect(t.grid).toMatch(/^rgba\(/);
    expect(t.shadow).toMatch(/^rgba\(/);
    expect(t.ring).toMatch(/^rgba\(/);
    expect(t.scrim).toMatch(/^rgba\(/);
    expect(t.soft).toMatch(/^rgba\(/);
  });
});

describe('cloudPath', () => {
  it.each([
    [200, 120],
    [320, 180],
    [390, 220],
  ])('returns a closed SVG path for %i×%i', (width, height) => {
    const path = cloudPath(width, height);
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path).toContain('A');
  });
});
