import { createTestDatabase, type TestDatabase } from '@/db/testClient';
import { completeLog } from '@/features/log/completeLog';
import { usePityStore } from '@/features/rewards/pityStore';
import { LOCAL_USER_ID } from '@/lib/localUser';

let mockDb: TestDatabase;

jest.mock('@/db/client', () => ({
  get db() {
    return mockDb;
  },
}));

jest.mock('@/features/rewards/engine', () => ({
  rollSticker: jest.fn(() => ({
    stickerId: 'common-gold-star' as const,
    rare: false,
    nextEmptyStreak: 0,
  })),
}));

describe('completeLog', () => {
  beforeEach(() => {
    mockDb = createTestDatabase();
    usePityStore.setState({ emptyStreak: 2 });
  });

  it('saves a kept item, awards a star, and rolls a sticker offline', async () => {
    const result = await completeLog({
      kind: 'kept',
      name: 'matcha',
      amountCents: 620,
      category: null,
      note: null,
    });

    expect(result).toMatchObject({
      kind: 'kept',
      amountCents: 620,
      monthCents: 620,
      starAwarded: true,
      starCount: 1,
      stickerId: 'common-gold-star',
      rare: false,
    });
    expect(result.itemId).toBeTruthy();
    expect(usePityStore.getState().emptyStreak).toBe(0);
  });

  it('does not award a second star the same day', async () => {
    await completeLog({
      kind: 'kept',
      name: 'one',
      amountCents: 100,
      category: null,
      note: null,
    });
    const second = await completeLog({
      kind: 'loved',
      name: 'coat',
      amountCents: null,
      category: null,
      note: null,
    });

    expect(second.starAwarded).toBe(false);
    expect(second.starCount).toBe(1);
    expect(second.kind).toBe('loved');
  });

  it('scopes month totals to the local user', async () => {
    const result = await completeLog({
      kind: 'kept',
      name: 'latte',
      amountCents: 450,
      category: null,
      note: null,
    });
    expect(result.monthCents).toBe(450);
    expect(LOCAL_USER_ID).toBeTruthy();
  });
});
