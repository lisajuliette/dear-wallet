import { createTestDatabase } from '@/db/testClient';
import { listPageStickers, replacePageStickers, saveDiaryEntry } from '@/features/diary/repository';
import { LOCAL_USER_ID } from '@/lib/localUser';

const userId = LOCAL_USER_ID;

describe('diary repository', () => {
  let db: ReturnType<typeof createTestDatabase>;

  beforeEach(() => {
    db = createTestDatabase();
  });

  it('creates and updates an entry for a day', async () => {
    const created = await saveDiaryEntry(db, {
      userId,
      entryDate: '2026-11-06',
      promptId: 'wallet_feeling',
      mood: 'chill',
      body: 'hello',
    });
    expect(created.body).toBe('hello');

    const updated = await saveDiaryEntry(db, {
      userId,
      entryDate: '2026-11-06',
      promptId: 'wallet_feeling',
      mood: 'proud',
      body: 'hello again',
    });
    expect(updated.id).toBe(created.id);
    expect(updated.mood).toBe('proud');
  });

  it('replaces page stickers and soft-deletes removed ones', async () => {
    const entry = await saveDiaryEntry(db, {
      userId,
      entryDate: '2026-11-06',
      promptId: null,
      mood: 'meh',
      body: '',
    });

    const first = await replacePageStickers(db, userId, entry.id, [
      {
        stickerId: 'common-gold-star',
        x: 0.2,
        y: 0.3,
        scale: 1,
        rotation: 0,
        z: 0,
      },
    ]);
    expect(first).toHaveLength(1);

    const second = await replacePageStickers(db, userId, entry.id, [
      {
        id: first[0]?.id,
        stickerId: 'common-gold-star',
        x: 0.5,
        y: 0.5,
        scale: 1.2,
        rotation: 0.2,
        z: 1,
      },
      {
        stickerId: 'common-lil-cloud',
        x: 0.7,
        y: 0.4,
        scale: 1,
        rotation: 0,
        z: 2,
      },
    ]);
    expect(second).toHaveLength(2);
    expect(second[0]?.x).toBe(0.5);

    const onlyCloud = await replacePageStickers(db, userId, entry.id, [
      {
        id: second[1]?.id,
        stickerId: 'common-lil-cloud',
        x: 0.7,
        y: 0.4,
        scale: 1,
        rotation: 0,
        z: 0,
      },
    ]);
    expect(onlyCloud).toHaveLength(1);
    expect(await listPageStickers(db, userId, entry.id)).toHaveLength(1);
  });
});
