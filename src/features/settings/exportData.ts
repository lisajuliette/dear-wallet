import { and, eq, isNull } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { diaryEntries, items } from '@/db/schema';
import type { ItemsDb } from '@/db/transaction';
import { LOCAL_USER_ID } from '@/lib/localUser';

/** Build a JSON dump of items + diary for Settings › export my data. */
export async function buildExportJson(
  db: ItemsDb,
  userId: string = LOCAL_USER_ID,
): Promise<object> {
  const itemRows = await db
    .select()
    .from(items)
    .where(and(eq(items.userId, userId), isNull(items.deletedAt)));
  const diaryRows = await db
    .select()
    .from(diaryEntries)
    .where(and(eq(diaryEntries.userId, userId), isNull(diaryEntries.deletedAt)));

  return {
    exportedAt: new Date().toISOString(),
    userId,
    items: itemRows.map((row) => ({
      id: row.id,
      kind: row.kind,
      name: row.name,
      amountCents: row.amountCents,
      currency: row.currency,
      note: row.note,
      photoPath: row.photoPath,
      tag: row.tag,
      boughtAfterAllAt: row.boughtAfterAllAt,
      happenedAt: row.happenedAt,
    })),
    diary: diaryRows.map((row) => ({
      id: row.id,
      entryDate: row.entryDate,
      promptId: row.promptId,
      mood: row.mood,
      body: row.body,
    })),
  };
}

export async function shareExportJson(db: ItemsDb): Promise<void> {
  const data = await buildExportJson(db);
  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!dir) throw new Error('no place to write export');
  const uri = `${dir}dear-wallet-export.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(data, null, 2));
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('sharing is not available');
  await Sharing.shareAsync(uri, {
    mimeType: 'application/json',
    dialogTitle: 'export my data',
  });
}
