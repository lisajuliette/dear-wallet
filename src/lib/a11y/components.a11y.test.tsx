import { View } from 'react-native';

import { Chip, IconButton, PillButton, Segmented } from '@/components';
import { assertPressablesLabeled } from '@/lib/a11y/pressableLabels';

import { renderWithTheme } from '../../../test/render';

describe('core controls expose accessibilityLabel', () => {
  it('IconButton', async () => {
    const { getAllByRole } = await renderWithTheme(
      <IconButton
        accessibilityLabel="Settings"
        icon={<View testID="icon-stub" />}
        onPress={() => undefined}
      />,
    );
    assertPressablesLabeled(getAllByRole('button'));
  });

  it('PillButton', async () => {
    const { getAllByRole } = await renderWithTheme(
      <PillButton label="nvm!" onPress={() => undefined} />,
    );
    assertPressablesLabeled(getAllByRole('button'));
  });

  it('Chip', async () => {
    const { getAllByRole } = await renderWithTheme(
      <Chip label="bubble tea" onPress={() => undefined} />,
    );
    assertPressablesLabeled(getAllByRole('button'));
  });

  it('Segmented', async () => {
    const { getAllByRole } = await renderWithTheme(
      <Segmented
        options={[
          { value: 'day', label: 'day' },
          { value: 'week', label: 'week' },
        ]}
        value="day"
        onChange={() => undefined}
      />,
    );
    assertPressablesLabeled(getAllByRole('tab'));
  });
});
