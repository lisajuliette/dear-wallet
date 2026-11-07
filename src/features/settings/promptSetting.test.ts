import { promptsFromStored } from '@/features/settings/promptSetting';

describe('promptsFromStored', () => {
  it('stays on unless explicitly turned off', () => {
    expect(promptsFromStored(null)).toBe(true);
    expect(promptsFromStored('1')).toBe(true);
    expect(promptsFromStored('0')).toBe(false);
  });
});
