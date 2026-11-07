import { scriptTextStyle } from './scriptText';

describe('scriptTextStyle', () => {
  it('gives Pacifico enough line height and top padding to clear ascenders', () => {
    const style = scriptTextStyle(30);
    expect(style.fontFamily).toBe('Pacifico_400Regular');
    expect(style.fontSize).toBe(30);
    expect(style.lineHeight).toBeGreaterThan(30);
    expect(style.paddingTop).toBeGreaterThan(0);
    expect(style.paddingBottom).toBeGreaterThan(0);
  });
});
