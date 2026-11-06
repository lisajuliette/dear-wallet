import { Text } from 'react-native';

import { HardShadow } from '@/components/HardShadow';

import { renderWithTheme } from '../../test/render';

describe('HardShadow', () => {
  it('exposes its accessibility label and children', async () => {
    const { getByLabelText, getByText } = await renderWithTheme(
      <HardShadow accessibilityLabel="shadowed card">
        <Text>inside</Text>
      </HardShadow>,
    );
    expect(getByLabelText('shadowed card')).toBeTruthy();
    expect(getByText('inside')).toBeTruthy();
  });
});
