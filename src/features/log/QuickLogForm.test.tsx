import { act } from '@testing-library/react-native';

import { QuickLogForm } from '@/features/log/QuickLogForm';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));

describe('QuickLogForm enable rules', () => {
  it('keeps nvm disabled until amount and name exist for kept', async () => {
    const onSave = jest.fn();
    const { getByRole, getByLabelText, getByTestId } = await renderWithTheme(
      <QuickLogForm onSave={onSave} onClose={() => {}} />,
    );

    expect(getByRole('button', { name: 'nvm!' })).toBeDisabled();

    await act(async () => {
      fireEvent.changeText(getByLabelText('What was it'), 'matcha');
    });
    expect(getByRole('button', { name: 'nvm!' })).toBeDisabled();

    await act(async () => {
      fireEvent.press(getByTestId('pad-key-1'));
      fireEvent.press(getByTestId('pad-key-2'));
    });
    expect(getByRole('button', { name: 'nvm!' })).not.toBeDisabled();

    await act(async () => {
      fireEvent.press(getByRole('button', { name: 'nvm!' }));
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'kept', name: 'matcha', amountCents: 1200 }),
    );
  });

  it('enables nvm for loved with only a name', async () => {
    const onSave = jest.fn();
    const { getByRole, getByLabelText, getByText } = await renderWithTheme(
      <QuickLogForm initialKind="loved" onSave={onSave} onClose={() => {}} />,
    );

    expect(getByText('a name is enough ♡')).toBeTruthy();

    await act(async () => {
      fireEvent.changeText(getByLabelText('What was it'), 'thrift coat');
    });
    expect(getByRole('button', { name: 'nvm!' })).not.toBeDisabled();

    await act(async () => {
      fireEvent.press(getByRole('button', { name: 'nvm!' }));
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'loved', name: 'thrift coat' }),
    );
  });

  it('shows category pills and keeps note and photo', async () => {
    const { getByText, getByLabelText } = await renderWithTheme(
      <QuickLogForm onSave={() => undefined} onClose={() => undefined} />,
    );
    expect(getByText('treats')).toBeTruthy();
    expect(getByLabelText('Add a category')).toBeTruthy();
    expect(getByText('+ note')).toBeTruthy();
    expect(getByText('+ photo')).toBeTruthy();
    expect(getByLabelText('Link')).toBeTruthy();
  });
});
