/** A calendar tap selects a day. It never opens another screen. Future days stay put. */
export function selectDay(
  date: string,
  todayKey: string,
): { date: string; selected: boolean; navigate: false } {
  if (date > todayKey) return { date, selected: false, navigate: false };
  return { date, selected: true, navigate: false };
}

export function isFutureDay(date: string, todayKey: string): boolean {
  return date > todayKey;
}
