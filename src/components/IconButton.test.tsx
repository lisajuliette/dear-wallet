import { Text } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { hitSlopForSize } from '@/lib/hitSlop';

import { renderWithTheme } from '../../test/render';

describe('IconButton', () => {
  it('requires an accessibility label and uses the button role', async () => {
    const { getByRole } = await renderWithTheme(
      <IconButton icon={<Text>×</Text>} accessibilityLabel="Close" />,
    );
    expect(getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('pads a smaller drawn size to a 44 pt hit area', async () => {
    expect(hitSlopForSize(24, 24)).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });
});
