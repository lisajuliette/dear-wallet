import { eq } from 'drizzle-orm';

import { items } from '@/db/schema';
import { createTestDatabase } from '@/db/testClient';
import { useAuthStore } from '@/features/sync/authStore';
import { pullItems } from '@/features/sync/pull';

describe('pullItems', () => {
  beforeEach(() => {
    useAuthStore.setState({
      ready: true,
      userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      isAnonymous: true,
      email: null,
    });
  });

  it('applies newer remote rows without marking dirty', async () => {
    const db = createTestDatabase();
    await db.insert(items).values({
      id: '11111111-1111-4111-8111-111111111111',
      userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      kind: 'kept',
      name: 'old',
      amountCents: 100,
      happenedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      dirty: false,
    });

    await pullItems(db, null, {
      fetchSince: async () => [
        {
          id: '11111111-1111-4111-8111-111111111111',
          user_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          kind: 'kept',
          name: 'newer',
          amount_cents: 200,
          currency: 'USD',
          happened_at: '2026-01-01T00:00:00.000Z',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-03T00:00:00.000Z',
          deleted_at: null,
        },
      ],
    });

    const row = await db
      .select()
      .from(items)
      .where(eq(items.id, '11111111-1111-4111-8111-111111111111'))
      .limit(1);
    expect(row[0]?.name).toBe('newer');
    expect(row[0]?.amountCents).toBe(200);
    expect(row[0]?.dirty).toBe(false);
  });

  it('keeps local when local is newer', async () => {
    const db = createTestDatabase();
    await db.insert(items).values({
      id: '11111111-1111-4111-8111-111111111111',
      userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      kind: 'kept',
      name: 'local-newer',
      amountCents: 300,
      happenedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-05T00:00:00.000Z',
      dirty: false,
    });

    await pullItems(db, null, {
      fetchSince: async () => [
        {
          id: '11111111-1111-4111-8111-111111111111',
          user_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          kind: 'kept',
          name: 'remote-older',
          amount_cents: 1,
          currency: 'USD',
          happened_at: '2026-01-01T00:00:00.000Z',
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
          deleted_at: null,
        },
      ],
    });

    const row = await db
      .select()
      .from(items)
      .where(eq(items.id, '11111111-1111-4111-8111-111111111111'))
      .limit(1);
    expect(row[0]?.name).toBe('local-newer');
  });
});
