import type { DayCardModel } from '@/features/diary/dayCardModel';
import { DiaryScreen, type DiaryViewModel } from '@/features/diary/DiaryScreen';

import { fireEvent, renderWithTheme } from '../../../test/render';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));
jest.mock('@/components/PixelIcon', () => ({
  PixelIcon: () => null,
}));
jest.mock('@/components/Sticker', () => ({
  Sticker: () => null,
}));

const day: DayCardModel = {
  label: 'SAT 7 NOV',
  aria: 'November 7',
  isToday: true,
  showStarChip: false,
  keptTotal: null,
  countLabel: null,
  rows: [],
  page: null,
  quiet: {
    title: "nothing logged today, and that's fine",
    sub: 'one line or just a mood counts',
  },
  cta: { kind: 'primary', label: "write today's page" },
};

const vm: DiaryViewModel = {
  promptText: 'how’s ur wallet feeling today?',
  starCount: 1,
  starWord: 'star',
  monthLabel: 'NOVEMBER 2026',
  showTodayChip: false,
  canGoPrev: true,
  canGoNext: false,
  days: [{ date: '2026-11-05' }, { date: '2026-11-07', today: true, selected: true }],
  day,
};

describe('DiaryScreen', () => {
  it('shows the write button, a shuffle control, and singular star copy', async () => {
    const onSelectDay = jest.fn();
    const { getByText, getByLabelText } = await renderWithTheme(
      <DiaryScreen
        vm={vm}
        onPrevMonth={() => undefined}
        onNextMonth={() => undefined}
        onToday={() => undefined}
        onSelectDay={onSelectDay}
        onShuffle={() => undefined}
        onOpenItem={() => undefined}
        onOpenPage={() => undefined}
      />,
    );
    expect(getByText("write today's page")).toBeTruthy();
    expect(getByLabelText('Show a different prompt')).toBeTruthy();
    expect(getByLabelText('1 star')).toBeTruthy();
    expect(getByText('star')).toBeTruthy();
    fireEvent.press(getByLabelText('2026-11-05'));
    expect(onSelectDay).toHaveBeenCalledWith('2026-11-05');
  });
});
