import { PillButton } from '@/components/PillButton';

import { renderWithTheme } from '../../test/render';

describe('PillButton', () => {
  it('exposes button role and label', async () => {
    const { getByRole } = await renderWithTheme(<PillButton label="nvm!" />);
    expect(getByRole('button', { name: 'nvm!' })).toBeTruthy();
  });

  it('marks disabled state and keeps the label', async () => {
    const { getByRole } = await renderWithTheme(<PillButton label="not yet" disabled />);
    expect(getByRole('button', { name: 'not yet' })).toBeDisabled();
  });

  it('supports secondary and link variants', async () => {
    const { getByRole } = await renderWithTheme(
      <>
        <PillButton label="secondary" variant="secondary" size="md" />
        <PillButton label="skip" variant="link" size="md" />
      </>,
    );
    expect(getByRole('button', { name: 'secondary' })).toBeTruthy();
    expect(getByRole('button', { name: 'skip' })).toBeTruthy();
  });
});
