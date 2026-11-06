/** Local calendar day key YYYY-MM-DD. */
export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a local day key into a Date at local midnight. */
export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map((part) => Number.parseInt(part, 10));
  if (!y || !m || !d) throw new Error(`Invalid day key: ${key}`);
  return new Date(y, m - 1, d);
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/** Monday-start week containing `date` (local). End is Sunday 23:59:59.999. */
export function weekRange(date: Date = new Date()): { start: Date; end: Date } {
  const day = startOfLocalDay(date);
  const weekday = day.getDay(); // 0 Sun … 6 Sat
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const start = new Date(day);
  start.setDate(day.getDate() - daysFromMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: startOfLocalDay(start), end: endOfLocalDay(end) };
}

/** Calendar month containing `date` (local). */
export function monthRange(date: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

/** Inclusive ISO bounds for SQLite text comparisons of timestamptz-like values. */
export function rangeIsoBounds(range: { start: Date; end: Date }): {
  startIso: string;
  endIso: string;
} {
  return {
    startIso: range.start.toISOString(),
    endIso: range.end.toISOString(),
  };
}

export function dayRange(date: Date = new Date()): { start: Date; end: Date } {
  return { start: startOfLocalDay(date), end: endOfLocalDay(date) };
}
