import { AmountPad } from '@/components/AmountPad';

import { fireEvent, renderWithTheme } from '../../test/render';

describe('AmountPad', () => {
  it('exposes twelve keys and forwards presses', async () => {
    const onKey = jest.fn();
    const { getByLabelText } = await renderWithTheme(
      <AmountPad onKey={onKey} hapticsEnabled={false} />,
    );

    expect(getByLabelText('amount pad')).toBeTruthy();
    fireEvent.press(getByLabelText('1'));
    fireEvent.press(getByLabelText('Decimal point'));
    fireEvent.press(getByLabelText('Delete'));

    expect(onKey).toHaveBeenCalledWith('1');
    expect(onKey).toHaveBeenCalledWith('.');
    expect(onKey).toHaveBeenCalledWith('back');
  });
});
