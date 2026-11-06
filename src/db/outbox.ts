import { outbox } from '@/db/schema';

/** Minimal insert surface shared by Expo and better-sqlite3 transactions. */
type Insertable = {
  insert: (table: typeof outbox) => {
    values: (value: { tableName: string; rowId: string }) => { run: () => unknown };
  };
};

/** Enqueue a dirty row for the sync worker. Call inside the same write transaction. */
export function enqueueOutbox(tx: Insertable, tableName: string, rowId: string): void {
  tx.insert(outbox)
    .values({
      tableName,
      rowId,
    })
    .run();
}
