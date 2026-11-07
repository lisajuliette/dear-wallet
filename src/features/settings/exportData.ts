import { and, eq, isNull } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { diaryEntries, items } from '@/db/schema';
import type { ItemsDb } from '@/db/transaction';
import {
  diaryToCsv,
  itemsToCsv,
  type ExportDiaryRow,
  type ExportItemRow,
} from '@/features/settings/exportCsv';
import {
  base64ToBytes,
  buildStoredZip,
  bytesToBase64,
  utf8Bytes,
} from '@/features/settings/zipStore';
import { getLocalUserId } from '@/lib/localUser';

export type ExportBundle = {
  items: ExportItemRow[];
  diary: ExportDiaryRow[];
};

export async function loadExportBundle(
  db: ItemsDb,
  userId: string = getLocalUserId(),
): Promise<ExportBundle> {
  const itemRows = await db
    .select()
    .from(items)
    .where(and(eq(items.userId, userId), isNull(items.deletedAt)));
  const diaryRows = await db
    .select()
    .from(diaryEntries)
    .where(and(eq(diaryEntries.userId, userId), isNull(diaryEntries.deletedAt)));

  return {
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

function photoName(path: string, id: string): string {
  const base = path.split('/').pop() || `${id}.jpg`;
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/** CSV of items and diary, plus a zip of photos, shared from Settings. */
export async function shareExport(db: ItemsDb): Promise<void> {
  const bundle = await loadExportBundle(db);
  const entries = [
    { name: 'items.csv', data: utf8Bytes(itemsToCsv(bundle.items)) },
    { name: 'diary.csv', data: utf8Bytes(diaryToCsv(bundle.diary)) },
  ];

  for (const item of bundle.items) {
    if (!item.photoPath) continue;
    const info = await FileSystem.getInfoAsync(item.photoPath);
    if (!info.exists) continue;
    const b64 = await FileSystem.readAsStringAsync(item.photoPath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    entries.push({
      name: `photos/${photoName(item.photoPath, item.id)}`,
      data: base64ToBytes(b64),
    });
  }

  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!dir) throw new Error('no place to write export');
  const uri = `${dir}dear-wallet-export.zip`;
  await FileSystem.writeAsStringAsync(uri, bytesToBase64(buildStoredZip(entries)), {
    encoding: FileSystem.EncodingType.Base64,
  });
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('sharing is not available');
  await Sharing.shareAsync(uri, {
    mimeType: 'application/zip',
    UTI: 'public.zip-archive',
    dialogTitle: 'export my data',
  });
}
