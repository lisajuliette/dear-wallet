import { act, fireEvent } from '@testing-library/react-native';
import { useState } from 'react';

import { Segmented } from '@/components/Segmented';

import { renderWithTheme } from '../../test/render';

function Harness() {
  const [value, setValue] = useState<'kept' | 'loved'>('kept');
  return (
    <Segmented
      value={value}
      onChange={setValue}
      options={[
        { label: "didn't buy", value: 'kept' },
        { label: 'loved it', value: 'loved' },
      ]}
    />
  );
}

describe('Segmented', () => {
  it('marks the selected tab and changes on press', async () => {
    const { getByRole } = await renderWithTheme(<Harness />);
    const kept = getByRole('tab', { name: "didn't buy" });
    const loved = getByRole('tab', { name: 'loved it' });
    expect(kept.props.accessibilityState).toMatchObject({ selected: true });
    expect(loved.props.accessibilityState).toMatchObject({ selected: false });

    await act(async () => {
      fireEvent.press(loved);
    });

    expect(getByRole('tab', { name: 'loved it' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
  });
});
