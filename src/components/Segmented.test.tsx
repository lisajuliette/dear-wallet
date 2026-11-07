import { act, fireEvent } from '@testing-library/react-native';
import { useState } from 'react';

import { Segmented } from '@/components/Segmented';
import { tokens } from '@/theme';

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

  it('paints the selected tally segment with c3', async () => {
    const { getByRole } = await renderWithTheme(
      <Segmented
        selectedFill="c3"
        value="week"
        onChange={() => undefined}
        options={[
          { label: 'day', value: 'day' },
          { label: 'week', value: 'week' },
        ]}
      />,
    );
    const week = getByRole('tab', { name: 'week' });
    const style = Array.isArray(week.props.style) ? week.props.style[0] : week.props.style;
    expect(style.backgroundColor).toBe(tokens('cloud').c3);
  });
});
