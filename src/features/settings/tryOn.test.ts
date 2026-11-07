import { useThemeStore } from '@/theme/store';

describe('palette try-on revert', () => {
  beforeEach(() => {
    useThemeStore.setState({ palette: 'cloud', previewPalette: null });
  });

  it('preview overrides active palette until cleared', () => {
    useThemeStore.getState().setPreviewPalette('midnight');
    expect(useThemeStore.getState().previewPalette).toBe('midnight');
    expect(useThemeStore.getState().palette).toBe('cloud');

    useThemeStore.getState().setPreviewPalette(null);
    expect(useThemeStore.getState().previewPalette).toBeNull();
  });

  it('setPalette clears try-on', () => {
    useThemeStore.getState().setPreviewPalette('orchid');
    useThemeStore.getState().setPalette('lilac');
    expect(useThemeStore.getState()).toMatchObject({
      palette: 'lilac',
      previewPalette: null,
    });
  });
});
