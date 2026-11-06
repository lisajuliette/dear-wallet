import { Text } from 'react-native';

import { Screen } from '@/components/Screen';

import { renderWithTheme } from '../../test/render';

describe('Screen', () => {
  it('renders children with a screen accessibility label', async () => {
    const { getByLabelText, getByText } = await renderWithTheme(
      <Screen accessibilityLabel="home screen">
        <Text>hello</Text>
      </Screen>,
    );
    expect(getByLabelText('home screen')).toBeTruthy();
    expect(getByText('hello')).toBeTruthy();
  });

  it('marks compact mode when forced', async () => {
    const { getByTestId } = await renderWithTheme(
      <Screen compact>
        <Text>compact</Text>
      </Screen>,
    );
    expect(getByTestId('screen-compact')).toBeTruthy();
  });
});
