import { sql } from 'drizzle-orm';
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** ISO timestamps stored as text; dates as YYYY-MM-DD. Local-only sync columns: dirty, synced_at. */

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  displayName: text('display_name'),
  palette: text('palette').notNull().default('cloud'),
  currency: text('currency').notNull().default('USD'),
  sounds: integer('sounds', { mode: 'boolean' }).notNull().default(true),
  haptics: integer('haptics', { mode: 'boolean' }).notNull().default(true),
  reducedMotion: integer('reduced_motion', { mode: 'boolean' }).notNull().default(false),
  appLock: text('app_lock').notNull().default('off'),
  checkinEnabled: integer('checkin_enabled', { mode: 'boolean' }).notNull().default(true),
  checkinWeekday: integer('checkin_weekday').notNull().default(0),
  checkinTime: text('checkin_time').notNull().default('19:00'),
  onboardedAt: text('onboarded_at'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
  syncedAt: text('synced_at'),
});

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  kind: text('kind', { enum: ['kept', 'loved'] }).notNull(),
  name: text('name').notNull(),
  amountCents: integer('amount_cents'),
  currency: text('currency').notNull().default('USD'),
  category: text('category'),
  note: text('note'),
  link: text('link'),
  photoPath: text('photo_path'),
  tag: text('tag', { enum: ['savings', 'debt'] }),
  boughtAfterAllAt: text('bought_after_all_at'),
  happenedAt: text('happened_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
  syncedAt: text('synced_at'),
});

export const diaryEntries = sqliteTable('diary_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  entryDate: text('entry_date').notNull(),
  promptId: text('prompt_id'),
  mood: text('mood', { enum: ['proud', 'chill', 'meh', 'tempted', 'wobbly'] }),
  body: text('body').notNull().default(''),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
  syncedAt: text('synced_at'),
});

export const pageStickers = sqliteTable('page_stickers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  diaryEntryId: text('diary_entry_id').notNull(),
  stickerId: text('sticker_id').notNull(),
  x: real('x').notNull(),
  y: real('y').notNull(),
  scale: real('scale').notNull().default(1),
  rotation: real('rotation').notNull().default(0),
  z: integer('z').notNull().default(0),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
  syncedAt: text('synced_at'),
});

export const stickerAwards = sqliteTable('sticker_awards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  stickerId: text('sticker_id').notNull(),
  source: text('source', { enum: ['log', 'diary', 'milestone', 'pack', 'quest'] }).notNull(),
  sourceId: text('source_id'),
  awardedAt: text('awarded_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
  syncedAt: text('synced_at'),
});

export const stars = sqliteTable(
  'stars',
  {
    userId: text('user_id').notNull(),
    day: text('day').notNull(),
    earnedBy: text('earned_by', { enum: ['log', 'diary', 'decorate', 'quest'] }).notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
    syncedAt: text('synced_at'),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);

export const quests = sqliteTable(
  'quests',
  {
    userId: text('user_id').notNull(),
    day: text('day').notNull(),
    questId: text('quest_id').notNull(),
    completedAt: text('completed_at'),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
    syncedAt: text('synced_at'),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);

export const milestones = sqliteTable(
  'milestones',
  {
    userId: text('user_id').notNull(),
    milestoneId: text('milestone_id').notNull(),
    achievedAt: text('achieved_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    seenAt: text('seen_at'),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
    syncedAt: text('synced_at'),
  },
  (table) => [primaryKey({ columns: [table.userId, table.milestoneId] })],
);

export const unlocks = sqliteTable(
  'unlocks',
  {
    userId: text('user_id').notNull(),
    unlockId: text('unlock_id').notNull(),
    unlockedAt: text('unlocked_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
    dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
    syncedAt: text('synced_at'),
  },
  (table) => [primaryKey({ columns: [table.userId, table.unlockId] })],
);

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  targetCents: integer('target_cents').notNull(),
  startedAt: text('started_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  reachedAt: text('reached_at'),
  archivedAt: text('archived_at'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
  deletedAt: text('deleted_at'),
  dirty: integer('dirty', { mode: 'boolean' }).notNull().default(true),
  syncedAt: text('synced_at'),
});

/** Local sync outbox — not mirrored to Supabase. */
export const outbox = sqliteTable('outbox', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tableName: text('table_name').notNull(),
  rowId: text('row_id').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
export type DiaryEntry = typeof diaryEntries.$inferSelect;
export type PageSticker = typeof pageStickers.$inferSelect;
export type Goal = typeof goals.$inferSelect;
