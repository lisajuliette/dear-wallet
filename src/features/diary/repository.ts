import { and, asc, desc, eq, gte, isNull, lte } from 'drizzle-orm';

import type { Mood } from '@/components/MoodPicker';
import type { StickerId } from '@/components/stickerAssets';
import { enqueueOutbox } from '@/db/outbox';
import {
  diaryEntries,
  pageStickers,
  stickerAwards,
  type DiaryEntry,
  type PageSticker,
} from '@/db/schema';
import { runTransaction, type ItemsDb } from '@/db/transaction';
import { dayKey, monthRange, rangeIsoBounds } from '@/lib/dates';
import { createId } from '@/lib/uuid';

export type { DiaryEntry, PageSticker, ItemsDb };

export type SaveDiaryInput = {
  userId: string;
  entryDate: string;
  promptId: string | null;
  mood: Mood | null;
  body: string;
  id?: string;
};

export type PageStickerInput = {
  id?: string;
  stickerId: StickerId;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z: number;
};

function nowIso(): string {
  return new Date().toISOString();
}

export async function getDiaryEntry(
  db: ItemsDb,
  userId: string,
  id: string,
): Promise<DiaryEntry | null> {
  return (
    db
      .select()
      .from(diaryEntries)
      .where(
        and(
          eq(diaryEntries.id, id),
          eq(diaryEntries.userId, userId),
          isNull(diaryEntries.deletedAt),
        ),
      )
      .get() ?? null
  );
}

export async function getDiaryByDate(
  db: ItemsDb,
  userId: string,
  entryDate: string,
): Promise<DiaryEntry | null> {
  return (
    db
      .select()
      .from(diaryEntries)
      .where(
        and(
          eq(diaryEntries.userId, userId),
          eq(diaryEntries.entryDate, entryDate),
          isNull(diaryEntries.deletedAt),
        ),
      )
      .get() ?? null
  );
}

export async function listDiaryByMonth(
  db: ItemsDb,
  userId: string,
  at: Date = new Date(),
): Promise<DiaryEntry[]> {
  const { startIso, endIso } = rangeIsoBounds(monthRange(at));
  const startDay = dayKey(new Date(startIso));
  const endDay = dayKey(new Date(endIso));
  return db
    .select()
    .from(diaryEntries)
    .where(
      and(
        eq(diaryEntries.userId, userId),
        isNull(diaryEntries.deletedAt),
        gte(diaryEntries.entryDate, startDay),
        lte(diaryEntries.entryDate, endDay),
      ),
    )
    .orderBy(desc(diaryEntries.entryDate))
    .all();
}

export async function listRecentDiary(
  db: ItemsDb,
  userId: string,
  limit = 10,
): Promise<DiaryEntry[]> {
  return db
    .select()
    .from(diaryEntries)
    .where(and(eq(diaryEntries.userId, userId), isNull(diaryEntries.deletedAt)))
    .orderBy(desc(diaryEntries.entryDate))
    .limit(limit)
    .all();
}

export async function listPromptHistory(
  db: ItemsDb,
  userId: string,
): Promise<{ promptId: string; usedAt: string }[]> {
  const rows = db
    .select({ promptId: diaryEntries.promptId, usedAt: diaryEntries.entryDate })
    .from(diaryEntries)
    .where(and(eq(diaryEntries.userId, userId), isNull(diaryEntries.deletedAt)))
    .all();
  return rows
    .filter((r): r is { promptId: string; usedAt: string } => !!r.promptId)
    .map((r) => ({ promptId: r.promptId, usedAt: r.usedAt }));
}

/** Create or update today's (or given) diary entry. */
export async function saveDiaryEntry(db: ItemsDb, input: SaveDiaryInput): Promise<DiaryEntry> {
  const updatedAt = nowIso();
  const existing = input.id
    ? await getDiaryEntry(db, input.userId, input.id)
    : await getDiaryByDate(db, input.userId, input.entryDate);

  if (existing) {
    let updated: DiaryEntry | undefined;
    runTransaction(db, (tx) => {
      updated = tx
        .update(diaryEntries)
        .set({
          promptId: input.promptId,
          mood: input.mood,
          body: input.body,
          updatedAt,
          dirty: true,
        })
        .where(and(eq(diaryEntries.id, existing.id), eq(diaryEntries.userId, input.userId)))
        .returning()
        .get();
      enqueueOutbox(tx, 'diary_entries', existing.id);
    });
    if (!updated) throw new Error('diary update failed');
    return updated;
  }

  const id = createId();
  let created: DiaryEntry | undefined;
  runTransaction(db, (tx) => {
    created = tx
      .insert(diaryEntries)
      .values({
        id,
        userId: input.userId,
        entryDate: input.entryDate,
        promptId: input.promptId,
        mood: input.mood,
        body: input.body,
        createdAt: updatedAt,
        updatedAt,
        dirty: true,
      })
      .returning()
      .get();
    enqueueOutbox(tx, 'diary_entries', id);
  });
  if (!created) throw new Error('diary insert failed');
  return created;
}

export async function listPageStickers(
  db: ItemsDb,
  userId: string,
  diaryEntryId: string,
): Promise<PageSticker[]> {
  return db
    .select()
    .from(pageStickers)
    .where(
      and(
        eq(pageStickers.userId, userId),
        eq(pageStickers.diaryEntryId, diaryEntryId),
        isNull(pageStickers.deletedAt),
      ),
    )
    .orderBy(asc(pageStickers.z))
    .all();
}

export async function listAllPageStickers(db: ItemsDb, userId: string): Promise<PageSticker[]> {
  return db
    .select()
    .from(pageStickers)
    .where(and(eq(pageStickers.userId, userId), isNull(pageStickers.deletedAt)))
    .all();
}

export async function listStickerAwards(
  db: ItemsDb,
  userId: string,
): Promise<{ stickerId: string }[]> {
  return db
    .select({ stickerId: stickerAwards.stickerId })
    .from(stickerAwards)
    .where(and(eq(stickerAwards.userId, userId), isNull(stickerAwards.deletedAt)))
    .all();
}

/** Replace active stickers on a page (soft-delete removed ones). */
export async function replacePageStickers(
  db: ItemsDb,
  userId: string,
  diaryEntryId: string,
  next: PageStickerInput[],
): Promise<PageSticker[]> {
  const updatedAt = nowIso();
  const existing = await listPageStickers(db, userId, diaryEntryId);
  const keepIds = new Set(next.map((s) => s.id).filter(Boolean));

  runTransaction(db, (tx) => {
    for (const row of existing) {
      if (!keepIds.has(row.id)) {
        tx.update(pageStickers)
          .set({ deletedAt: updatedAt, updatedAt, dirty: true })
          .where(eq(pageStickers.id, row.id))
          .run();
        enqueueOutbox(tx, 'page_stickers', row.id);
      }
    }

    for (const sticker of next) {
      if (sticker.id && existing.some((e) => e.id === sticker.id)) {
        tx.update(pageStickers)
          .set({
            stickerId: sticker.stickerId,
            x: sticker.x,
            y: sticker.y,
            scale: sticker.scale,
            rotation: sticker.rotation,
            z: sticker.z,
            updatedAt,
            dirty: true,
            deletedAt: null,
          })
          .where(eq(pageStickers.id, sticker.id))
          .run();
        enqueueOutbox(tx, 'page_stickers', sticker.id);
      } else {
        const id = sticker.id ?? createId();
        tx.insert(pageStickers)
          .values({
            id,
            userId,
            diaryEntryId,
            stickerId: sticker.stickerId,
            x: sticker.x,
            y: sticker.y,
            scale: sticker.scale,
            rotation: sticker.rotation,
            z: sticker.z,
            createdAt: updatedAt,
            updatedAt,
            dirty: true,
          })
          .run();
        enqueueOutbox(tx, 'page_stickers', id);
      }
    }
  });

  return listPageStickers(db, userId, diaryEntryId);
}
