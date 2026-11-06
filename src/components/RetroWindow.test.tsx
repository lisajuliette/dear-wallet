import { Text } from 'react-native';

import { RetroWindow } from '@/components/RetroWindow';

import { renderWithTheme } from '../../test/render';

describe('RetroWindow', () => {
  it('renders the title and children', async () => {
    const { getByText, getByLabelText } = await renderWithTheme(
      <RetroWindow title="WINDOW TITLE">
        <Text>body copy</Text>
      </RetroWindow>,
    );
    expect(getByText('WINDOW TITLE')).toBeTruthy();
    expect(getByText('body copy')).toBeTruthy();
    expect(getByLabelText('WINDOW TITLE')).toBeTruthy();
  });

  it('supports a custom accessibility label', async () => {
    const { getByLabelText } = await renderWithTheme(
      <RetroWindow title="kept" accessibilityLabel="kept window">
        <Text>ok</Text>
      </RetroWindow>,
    );
    expect(getByLabelText('kept window')).toBeTruthy();
  });
});
