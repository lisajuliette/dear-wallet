import { dayKey } from '@/lib/dates';

/** YYYY-MM for a local date. */
export function monthKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

/** Earlier of the given day keys or ISO timestamps, as YYYY-MM. */
export function earliestMonth(dates: (string | null | undefined)[]): string | null {
  let best: string | null = null;
  for (const raw of dates) {
    if (!raw) continue;
    const day = raw.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    const month = day.slice(0, 7);
    if (!best || month < best) best = month;
  }
  return best;
}

export function canGoPrev(cursor: Date, earliest: string | null): boolean {
  if (!earliest) return false;
  return monthKey(cursor) > earliest;
}

export function canGoNext(cursor: Date, today: Date): boolean {
  return monthKey(cursor) < monthKey(today);
}

export function showTodayChip(cursor: Date, today: Date): boolean {
  return monthKey(cursor) !== monthKey(today);
}

export function shiftMonth(cursor: Date, delta: number): Date {
  return new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
}

/** Keep the same day-of-month. A day that has not happened yet becomes today. */
export function dayAfterMonthChange(nextMonth: Date, dayOfMonth: number, today: Date): string {
  const last = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
  const day = Math.min(Math.max(dayOfMonth, 1), last);
  const key = dayKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day));
  const todayKey = dayKey(today);
  return key > todayKey ? todayKey : key;
}
