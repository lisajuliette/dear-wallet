import { Text } from 'react-native';

import { CloudCard } from '@/components/CloudCard';

import { renderWithTheme } from '../../test/render';

describe('CloudCard', () => {
  it('renders with an accessibility label and children', async () => {
    const { getByLabelText, getByText } = await renderWithTheme(
      <CloudCard fill="c3" height={76} accessibilityLabel="goal cloud">
        <Text>goal</Text>
      </CloudCard>,
    );
    expect(getByLabelText('goal cloud')).toBeTruthy();
    expect(getByText('goal')).toBeTruthy();
  });
});
