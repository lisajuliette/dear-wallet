import { orderOutbox, retryDelayMs } from '@/features/sync/outboxWorker';

describe('outbox worker', () => {
  it('orders by id ascending (FIFO)', () => {
    expect(
      orderOutbox([
        { id: 3, tableName: 'items', rowId: 'c' },
        { id: 1, tableName: 'items', rowId: 'a' },
        { id: 2, tableName: 'items', rowId: 'b' },
      ]).map((r) => r.rowId),
    ).toEqual(['a', 'b', 'c']);
  });

  it('uses exponential backoff capped at 30s', () => {
    expect(retryDelayMs(0)).toBe(500);
    expect(retryDelayMs(1)).toBe(1000);
    expect(retryDelayMs(2)).toBe(2000);
    expect(retryDelayMs(10)).toBe(30_000);
  });
});
