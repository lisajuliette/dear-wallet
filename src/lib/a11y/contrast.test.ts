import { contrastRatio } from '@/lib/a11y/contrast';
import { palettes, type PaletteKey } from '@/theme/theme';

const KEYS = Object.keys(palettes) as PaletteKey[];

describe('palette contrast (AA)', () => {
  it.each(KEYS)('%s text on surface ≥ 4.5', (key) => {
    const c = palettes[key].colors;
    expect(contrastRatio(c.text, c.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(KEYS)('%s btnText on btn ≥ 4.5', (key) => {
    const c = palettes[key].colors;
    expect(contrastRatio(c.btnText, c.btn)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(KEYS)('%s text on bg1 ≥ 4.5', (key) => {
    const c = palettes[key].colors;
    expect(contrastRatio(c.text, c.bg1)).toBeGreaterThanOrEqual(4.5);
  });
});
