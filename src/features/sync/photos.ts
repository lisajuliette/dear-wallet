import { and, eq, isNotNull, isNull } from 'drizzle-orm';

import { items } from '@/db/schema';
import type { ItemsDb } from '@/db/transaction';
import { supabase, supabaseConfigured } from '@/features/sync/supabase';
import { getLocalUserId } from '@/lib/localUser';

/** Upload local item photos to item-photos/{userId}/{itemId}.jpg when online. */
export async function uploadPendingPhotos(db: ItemsDb): Promise<number> {
  if (!supabaseConfigured) return 0;
  const userId = getLocalUserId();
  const rows = await db
    .select()
    .from(items)
    .where(and(eq(items.userId, userId), isNotNull(items.photoPath), isNull(items.deletedAt)));

  let uploaded = 0;
  for (const row of rows) {
    const localPath = row.photoPath;
    if (!localPath || localPath.startsWith('item-photos/')) continue;
    if (!localPath.startsWith('file:') && !localPath.startsWith('/')) continue;

    try {
      const response = await fetch(localPath);
      const blob = await response.blob();
      const path = `${userId}/${row.id}.jpg`;
      const { error } = await supabase.storage.from('item-photos').upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });
      if (error) continue;
      await db
        .update(items)
        .set({ photoPath: `item-photos/${path}`, dirty: true })
        .where(eq(items.id, row.id));
      uploaded += 1;
    } catch {
      // leave local path for next attempt
    }
  }
  return uploaded;
}
