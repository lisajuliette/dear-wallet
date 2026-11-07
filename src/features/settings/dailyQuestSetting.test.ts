import { dailyQuestsFromStored } from '@/features/settings/dailyQuestSetting';

describe('dailyQuestsFromStored', () => {
  it('stays on unless explicitly turned off', () => {
    expect(dailyQuestsFromStored(null)).toBe(true);
    expect(dailyQuestsFromStored('1')).toBe(true);
    expect(dailyQuestsFromStored('0')).toBe(false);
  });
});
