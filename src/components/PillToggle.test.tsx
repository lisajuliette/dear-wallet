import { act, fireEvent } from '@testing-library/react-native';
import { useState } from 'react';

import { PillToggle } from '@/components/PillToggle';

import { renderWithTheme } from '../../test/render';

function Harness() {
  const [value, setValue] = useState(true);
  return <PillToggle label="sounds" value={value} onChange={setValue} />;
}

describe('PillToggle', () => {
  it('uses the switch role and toggles checked state', async () => {
    const { getByRole } = await renderWithTheme(<Harness />);
    const control = getByRole('switch', { name: 'sounds' });
    expect(control.props.accessibilityState).toMatchObject({ checked: true });

    await act(async () => {
      fireEvent.press(control);
    });

    expect(getByRole('switch', { name: 'sounds' }).props.accessibilityState).toMatchObject({
      checked: false,
    });
  });
});
