import { buildHomeViewModel } from '@/features/home/homeModel';

const base = {
  displayName: 'Jazmine',
  starCount: 0,
  todayCents: 0,
  monthCents: 0,
  todayItems: [] as never[],
  allTimeItemCount: 0,
  dayKey: '2026-11-06',
  userId: 'user-1',
  questCompleted: false,
  hasGoal: false,
};

describe('buildHomeViewModel', () => {
  it('marks first day', () => {
    const vm = buildHomeViewModel(base);
    expect(vm.state).toBe('first_day');
    expect(vm.greeting).toContain('DAY ONE');
    expect(vm.questId).toBe('first_diary_line');
  });

  it('marks empty today when history exists but no today rows', () => {
    const vm = buildHomeViewModel({ ...base, allTimeItemCount: 3 });
    expect(vm.state).toBe('empty_today');
  });

  it('marks active when today has items', () => {
    const vm = buildHomeViewModel({
      ...base,
      allTimeItemCount: 2,
      todayItems: [
        {
          id: '1',
          userId: 'user-1',
          kind: 'kept',
          name: 'tea',
          amountCents: 500,
          currency: 'USD',
          category: null,
          note: null,
          link: null,
          photoPath: null,
          tag: null,
          boughtAfterAllAt: null,
          happenedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          dirty: true,
          syncedAt: null,
        },
      ],
      todayCents: 500,
    });
    expect(vm.state).toBe('active');
    expect(vm.todayCaption).toContain("didn't buy");
  });

  it('marks quest done when completed', () => {
    const vm = buildHomeViewModel({
      ...base,
      allTimeItemCount: 2,
      questCompleted: true,
    });
    expect(vm.state).toBe('quest_done');
  });
});
