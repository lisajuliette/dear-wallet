import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import * as schema from '@/db/schema';

export type TestDatabase = BetterSQLite3Database<typeof schema>;

/** In-memory SQLite with the same schema migrations applied (for repository tests). */
export function createTestDatabase(): TestDatabase {
  const sqlite = new Database(':memory:');
  const migrationsDir = join(__dirname, '../../drizzle');
  const journal = JSON.parse(readFileSync(join(migrationsDir, 'meta/_journal.json'), 'utf8')) as {
    entries: { tag: string }[];
  };

  for (const entry of journal.entries) {
    const raw = readFileSync(join(migrationsDir, `${entry.tag}.sql`), 'utf8');
    for (const statement of raw.split('--> statement-breakpoint')) {
      const sql = statement.trim();
      if (sql.length > 0) sqlite.exec(sql);
    }
  }

  return drizzle(sqlite, { schema });
}
