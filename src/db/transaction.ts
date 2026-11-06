import type * as schema from '@/db/schema';

import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

/** Shared sync SQLite database surface (Expo app + better-sqlite3 tests). */
export type ItemsDb = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/** Runs write work in one SQLite transaction (sync callback — required by both drivers). */
export function runTransaction(db: ItemsDb, work: (tx: ItemsDb) => void): void {
  db.transaction((tx) => {
    work(tx);
  });
}
