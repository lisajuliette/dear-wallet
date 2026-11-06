import { eq } from 'drizzle-orm';

import { stickerAwards } from '@/db/schema';
import { createTestDatabase } from '@/db/testClient';
import { awardSticker } from '@/features/rewards/stickers';
import { LOCAL_USER_ID } from '@/lib/localUser';

const userId = LOCAL_USER_ID;

describe('stickers', () => {
  let db: ReturnType<typeof createTestDatabase>;

  beforeEach(() => {
    db = createTestDatabase();
  });

  it('inserts a dirty sticker award row', () => {
    const id = awardSticker(db, userId, 'common-gold-star', 'log', 'item-1');
    const rows = db.select().from(stickerAwards).where(eq(stickerAwards.id, id)).all();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      userId,
      stickerId: 'common-gold-star',
      source: 'log',
      sourceId: 'item-1',
      dirty: true,
    });
  });

  it('allows awards without a source id', () => {
    const id = awardSticker(db, userId, 'rare-holo-cd', 'diary');
    const row = db.select().from(stickerAwards).where(eq(stickerAwards.id, id)).get();
    expect(row?.sourceId).toBeNull();
  });
});
