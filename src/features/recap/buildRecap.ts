import { formatCents } from '@/lib/money';

export type RecapPeriod = 'week' | 'month';
export type RecapKind = 'wanted' | 'loved';

export type RecapItemInput = {
  id: string;
  name: string;
  amountCents: number | null;
  happenedAt: string;
  kind: 'kept' | 'loved';
  boughtAfterAllAt?: string | null;
};

export type RecapTrack = {
  n: string;
  name: string;
  /** Amount for wanted, date label for loved. Never a price for loved. */
  right: string;
};

export type RecapData = {
  period: RecapPeriod;
  kind: RecapKind;
  title: string;
  dateLabel: string;
  coverTag: string;
  coverMonthShort: string;
  listTitle: string;
  totalChip: string;
  totalCents: number;
  tracks: RecapTrack[];
  moreCount: number;
  moreLine: string | null;
  quiet: boolean;
  empty: boolean;
  weekLabel: string;
  weekFootLabel: string;
};

const MONTH_SHORT = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function dateRight(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase();
}

function titleFor(period: RecapPeriod, kind: RecapKind): string {
  if (period === 'month' && kind === 'wanted') return "wanted but didn't";
  if (period === 'month' && kind === 'loved') return 'loved this month';
  if (period === 'week' && kind === 'wanted') return 'this week i said nvm to';
  return 'loved this week';
}

/**
 * Pure builder for recap card + screen preview data.
 * Wanted = kept items not bought-after-all; loved = loved items (no prices).
 */
export function buildRecap(input: {
  period: RecapPeriod;
  kind: RecapKind;
  at: Date;
  items: RecapItemInput[];
}): RecapData {
  const { period, kind, at, items } = input;
  const filtered =
    kind === 'wanted'
      ? items.filter((i) => i.kind === 'kept' && !i.boughtAfterAllAt)
      : items.filter((i) => i.kind === 'loved');

  const sorted =
    kind === 'wanted'
      ? [...filtered].sort((a, b) => (b.amountCents ?? 0) - (a.amountCents ?? 0))
      : [...filtered].sort((a, b) => b.happenedAt.localeCompare(a.happenedAt));

  const totalCents =
    kind === 'wanted' ? sorted.reduce((sum, i) => sum + (i.amountCents ?? 0), 0) : sorted.length;

  const quiet = period === 'month' && sorted.length > 0 && sorted.length <= 2;
  const empty = sorted.length === 0;
  const topLimit = period === 'month' ? 10 : 7;
  const top = sorted.slice(0, topLimit);
  const moreCount = Math.max(0, sorted.length - top.length);

  const tracks: RecapTrack[] = top.map((item, index) => ({
    n: String(index + 1).padStart(2, '0'),
    name: item.name,
    right: kind === 'wanted' ? formatCents(item.amountCents ?? 0) : dateRight(item.happenedAt),
  }));

  const monthShort = MONTH_SHORT[at.getMonth()] ?? 'nov';
  const weekNum = isoWeekNumber(at);
  const dateLabel =
    period === 'month'
      ? at.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase()
      : `WEEK ${weekNum}`;

  return {
    period,
    kind,
    title: titleFor(period, kind),
    dateLabel,
    coverTag: kind === 'wanted' ? 'A DEAR WALLET MIXTAPE' : 'THE LOVED EDITION',
    coverMonthShort: monthShort,
    listTitle: period === 'week' ? `THIS WEEK · ${sorted.length}` : `TRACK LIST · ${sorted.length}`,
    totalChip: kind === 'wanted' ? `${formatCents(totalCents)} KEPT` : `${sorted.length} LOVED`,
    totalCents: kind === 'wanted' ? totalCents : 0,
    tracks,
    moreCount,
    moreLine:
      moreCount > 0
        ? `+ ${moreCount} more tiny wins`
        : quiet
          ? 'a quiet month is still a hit ♡'
          : null,
    quiet,
    empty,
    weekLabel: `WEEK_${String(weekNum).padStart(2, '0')}.EXE`,
    weekFootLabel: kind === 'wanted' ? 'KEPT THIS WEEK' : '3 THINGS THAT MADE MY WEEK',
  };
}
