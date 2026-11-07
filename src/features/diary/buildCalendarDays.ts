import type { CalendarDay } from '@/components/CalendarMonth';
import type { Mood } from '@/components/MoodPicker';
import { dayKey } from '@/lib/dates';

type EntryLike = { entryDate: string; mood: Mood | null };
type StarLike = { day: string };

/** Build a Monday-first month grid (padded to 42 cells) for CalendarMonth. */
export function buildCalendarDays(
  at: Date,
  entries: EntryLike[],
  stars: StarLike[],
  today: Date = new Date(),
  selected?: string,
): CalendarDay[] {
  const year = at.getFullYear();
  const month = at.getMonth();
  const first = new Date(year, month, 1);
  const weekday = first.getDay(); // 0 Sun
  const pad = weekday === 0 ? 6 : weekday - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = dayKey(today);
  const entryByDay = new Map(entries.map((e) => [e.entryDate, e]));
  const starDays = new Set(stars.map((s) => s.day));

  const days: CalendarDay[] = [];
  for (let i = 0; i < pad; i += 1) {
    days.push({ date: `pad-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const key = dayKey(new Date(year, month, d));
    const entry = entryByDay.get(key);
    const mood = entry?.mood ?? null;
    const showedUp = starDays.has(key) && !mood;
    days.push({
      date: key,
      star: showedUp,
      mood,
      today: key === todayKey,
      selected: key === selected,
      future: key > todayKey,
    });
  }
  while (days.length % 7 !== 0 || days.length < 42) {
    days.push({ date: `pad-${days.length}` });
    if (days.length >= 42) break;
  }
  return days;
}
