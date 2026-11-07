import type { Mood } from '@/components/MoodPicker';
import type { StickerId } from '@/components/stickerAssets';
import { parseDayKey } from '@/lib/dates';
import { formatCents } from '@/lib/money';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;

export type DayLog = {
  id: string;
  name: string;
  kind: 'kept' | 'loved';
  amountCents: number | null;
  category: string | null;
  boughtAfterAll: boolean;
};

export type DayPage = {
  id: string;
  mood: Mood | null;
  body: string;
};

export type DayCardInput = {
  date: string;
  todayKey: string;
  items: DayLog[];
  page: DayPage | null;
  hasStar: boolean;
};

export type DayCardRow = {
  id: string;
  name: string;
  subtitle: string;
  amount: string;
  sticker: StickerId;
};

export type DayCardModel = {
  label: string;
  aria: string;
  isToday: boolean;
  showStarChip: boolean;
  keptTotal: string | null;
  countLabel: string | null;
  rows: DayCardRow[];
  page: { id: string; mood: Mood | null; line: string } | null;
  quiet: { title: string; sub: string } | null;
  cta: { kind: 'primary' | 'ghost'; label: string };
};

export function itemSticker(kind: DayLog['kind'], category: string | null): StickerId {
  if (kind === 'loved') return 'common-pixel-heart';
  switch (category) {
    case 'treats':
      return 'common-nvmd-boba';
    case 'food':
      return 'common-lip-gloss';
    case 'clothes':
      return 'common-butterfly';
    case 'home':
      return 'common-lil-cloud';
    default:
      return 'common-nvm-bubble';
  }
}

/** Bought-after-all logs leave the day. Loved logs stay, and never add to the kept total. */
export function visibleDayLogs(items: DayLog[]): DayLog[] {
  return items.filter((item) => !item.boughtAfterAll);
}

export function keptTotalCents(items: DayLog[]): number {
  return visibleDayLogs(items)
    .filter((item) => item.kind === 'kept')
    .reduce((sum, item) => sum + (item.amountCents ?? 0), 0);
}

export function dayCountLabel(items: DayLog[]): string {
  const visible = visibleDayLogs(items);
  const nvms = visible.filter((item) => item.kind === 'kept').length;
  const loved = visible.filter((item) => item.kind === 'loved').length;
  const parts: string[] = [];
  if (nvms > 0) parts.push(`${nvms} ${nvms === 1 ? 'nvm' : 'nvms'}`);
  if (loved > 0) parts.push(`${loved} loved`);
  return parts.join(' · ');
}

export function dayCta(isToday: boolean, hasPage: boolean): DayCardModel['cta'] {
  if (hasPage) {
    return {
      kind: 'ghost',
      label: isToday ? "open today's page" : 'open this page',
    };
  }
  return { kind: 'primary', label: "write today's page" };
}

export function quietCopy(isToday: boolean): { title: string; sub: string } {
  if (isToday) {
    return {
      title: "nothing logged today, and that's fine",
      sub: 'one line or just a mood counts',
    };
  }
  return {
    title: "a quiet day. that's allowed ♡",
    sub: 'no nvms and no page on this day',
  };
}

export function starWord(count: number): string {
  return count === 1 ? 'star' : 'stars';
}

export function dayHeading(date: string): { label: string; aria: string } {
  const parsed = parseDayKey(date);
  const weekday = WEEKDAYS[parsed.getDay()] ?? 'DAY';
  const month = MONTHS[parsed.getMonth()] ?? '';
  const monthName = parsed.toLocaleDateString('en-US', { month: 'long' });
  return {
    label: `${weekday} ${parsed.getDate()} ${month}`,
    aria: `${monthName} ${parsed.getDate()}`,
  };
}

export function buildDayCard(input: DayCardInput): DayCardModel {
  const visible = visibleDayLogs(input.items);
  const heading = dayHeading(input.date);
  const isToday = input.date === input.todayKey;
  const hasPage = input.page !== null;
  const quiet = visible.length === 0 && !hasPage;
  return {
    label: heading.label,
    aria: heading.aria,
    isToday,
    showStarChip: input.hasStar,
    keptTotal: visible.length > 0 ? formatCents(keptTotalCents(input.items)) : null,
    countLabel: visible.length > 0 ? dayCountLabel(input.items) : null,
    rows: visible.map((item) => ({
      id: item.id,
      name: item.name,
      subtitle: item.kind === 'loved' ? 'loved it' : "didn't buy",
      amount: item.kind === 'loved' ? '♡' : formatCents(item.amountCents ?? 0),
      sticker: itemSticker(item.kind, item.category),
    })),
    page: input.page
      ? { id: input.page.id, mood: input.page.mood, line: input.page.body.trim() }
      : null,
    quiet: quiet ? quietCopy(isToday) : null,
    cta: dayCta(isToday, hasPage),
  };
}
