import { DiaryEntryScreen } from '@/features/diary/DiaryEntryScreen';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));
jest.mock('@/components/Sticker', () => ({
  Sticker: () => null,
}));

describe('DiaryEntryScreen save rules', () => {
  it('keeps save disabled until mood or text exists', async () => {
    const onSave = jest.fn();
    const empty = await renderWithTheme(
      <DiaryEntryScreen
        vm={{
          title: 'NOV 6 · NEW ENTRY',
          promptText: 'how is ur wallet?',
          mood: null,
          body: '',
          isNew: true,
          entryId: null,
        }}
        onClose={() => {}}
        onShufflePrompt={() => {}}
        onChangeMood={() => {}}
        onChangeBody={() => {}}
        onSave={onSave}
        onDecorate={() => {}}
      />,
    );
    expect(empty.getByLabelText('save')).toBeDisabled();

    const withMood = await renderWithTheme(
      <DiaryEntryScreen
        vm={{
          title: 'NOV 6 · NEW ENTRY',
          promptText: 'how is ur wallet?',
          mood: 'chill',
          body: '',
          isNew: true,
          entryId: null,
        }}
        onClose={() => {}}
        onShufflePrompt={() => {}}
        onChangeMood={() => {}}
        onChangeBody={() => {}}
        onSave={onSave}
        onDecorate={() => {}}
      />,
    );
    expect(withMood.getByLabelText('save')).not.toBeDisabled();
    fireEvent.press(withMood.getByLabelText('save'));
    expect(onSave).toHaveBeenCalled();
  });
});
