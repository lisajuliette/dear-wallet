import { dayKey, monthRange, weekRange } from '@/lib/dates';
import { formatCents } from '@/lib/money';

export type TallyRange = 'day' | 'week' | 'month';

export type TallyBar = {
  label: string;
  cents: number;
};

export type TallyBarItem = {
  kind: 'kept' | 'loved';
  amountCents: number | null;
  happenedAt: string;
  boughtAfterAllAt: string | null;
};

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

function isActiveKept(item: TallyBarItem): boolean {
  return item.kind === 'kept' && item.boughtAfterAllAt == null && (item.amountCents ?? 0) > 0;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Week bars Mon–Sun, month bars wk 1–5. Day has no chart in v1. */
export function buildTallyBars(
  range: TallyRange,
  items: TallyBarItem[],
  at: Date = new Date(),
): TallyBar[] {
  const kept = items.filter(isActiveKept);

  if (range === 'day') return [];

  if (range === 'week') {
    const { start } = weekRange(at);
    const buckets = WEEKDAY_LABELS.map((label) => ({ label, cents: 0 }));
    for (const item of kept) {
      const when = new Date(item.happenedAt);
      const day = startOfLocalDay(when);
      const offset = Math.round((day.getTime() - startOfLocalDay(start).getTime()) / 86_400_000);
      if (offset >= 0 && offset < 7) {
        const bucket = buckets[offset];
        if (bucket) bucket.cents += item.amountCents ?? 0;
      }
    }
    return buckets;
  }

  const { start, end } = monthRange(at);
  const weekStarts: Date[] = [];
  let cursor = startOfLocalDay(start);
  // Align first week to the Monday on/before the 1st so week buckets match weekRange.
  const weekday = cursor.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  cursor = new Date(cursor);
  cursor.setDate(cursor.getDate() - daysFromMonday);

  while (cursor <= end && weekStarts.length < 5) {
    weekStarts.push(new Date(cursor));
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() + 7);
  }

  const buckets = weekStarts.map((_, i) => ({ label: `wk ${i + 1}`, cents: 0 }));
  for (const item of kept) {
    const when = startOfLocalDay(new Date(item.happenedAt));
    for (let i = 0; i < weekStarts.length; i += 1) {
      const weekStart = weekStarts[i];
      if (!weekStart) continue;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      if (when >= weekStart && when <= weekEnd) {
        const bucket = buckets[i];
        if (bucket) bucket.cents += item.amountCents ?? 0;
        break;
      }
    }
  }
  return buckets;
}

export function tallyWindowTitle(range: TallyRange): string {
  if (range === 'day') return 'KEPT TODAY';
  if (range === 'week') return 'KEPT THIS WEEK';
  return 'KEPT THIS MONTH';
}

export function tallyListTitle(range: TallyRange): string {
  if (range === 'day') return 'TODAY';
  if (range === 'week') return 'THIS WEEK';
  return 'THIS MONTH';
}

/** Captions from COPY.md for empty / quiet / biggest-week. */
export function tallyCaption(range: TallyRange, bars: TallyBar[], totalCents: number): string {
  if (totalCents <= 0) return "nothing yet, and that's fine";

  if (range === 'week') {
    const active = bars.filter((b) => b.cents > 0);
    if (active.length <= 1) return 'a quiet week. still counts ♡';
  }

  if (range === 'month' && bars.length > 0) {
    let bestIndex = 0;
    let bestCents = -1;
    bars.forEach((bar, index) => {
      if (bar.cents > bestCents) {
        bestCents = bar.cents;
        bestIndex = index;
      }
    });
    if (bestCents > 0) return `wk ${bestIndex + 1} was ur biggest week ✦`;
  }

  if (range === 'day') return 'ur kept things land here';
  return 'small week, still a win ♡';
}

export function tallyListNote(
  range: TallyRange,
  itemCount: number,
  totalCents: number,
): string | null {
  if (itemCount === 0) return 'ur kept things land here';
  if (range === 'week' && totalCents > 0 && itemCount <= 2) return 'small week, still a win ♡';
  return null;
}

export function sideTotalsLabel(savingsCents: number, debtCents: number): string {
  if (savingsCents <= 0 && debtCents <= 0) return 'tag any item to\nsee these';
  return `savings ${formatCents(savingsCents)}\ndebt paid ${formatCents(debtCents)}`;
}

/** Local YYYY-MM used by loved month switcher. */
export function monthKey(date: Date = new Date()): string {
  return dayKey(date).slice(0, 7);
}
