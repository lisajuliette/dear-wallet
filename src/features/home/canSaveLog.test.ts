import { canSaveLog } from '@/features/home/canSaveLog';

describe('canSaveLog', () => {
  it('requires amount and name for kept', () => {
    expect(canSaveLog('kept', '', '')).toBe(false);
    expect(canSaveLog('kept', '12', '')).toBe(false);
    expect(canSaveLog('kept', '', 'tea')).toBe(false);
    expect(canSaveLog('kept', '12.', 'tea')).toBe(false);
    expect(canSaveLog('kept', '12', 'tea')).toBe(true);
    expect(canSaveLog('kept', '12.50', 'tea')).toBe(true);
  });

  it('requires only a name for loved', () => {
    expect(canSaveLog('loved', '', '')).toBe(false);
    expect(canSaveLog('loved', '', 'coat')).toBe(true);
    expect(canSaveLog('loved', '99', 'coat')).toBe(true);
  });
});
