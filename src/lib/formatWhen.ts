const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sept',
  'oct',
  'nov',
  'dec',
] as const;

/** "sept 12" — short date used on Goal. */
export function formatShortDate(date: Date): string {
  const month = MONTHS[date.getMonth()] ?? 'jan';
  return `${month} ${date.getDate()}`;
}

/** "3:12 pm" — clock time on Home rows. */
export function formatClock(date: Date): string {
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const hour24 = date.getHours();
  const suffix = hour24 >= 12 ? 'pm' : 'am';
  const hour = hour24 % 12 || 12;
  return `${hour}:${minutes} ${suffix}`;
}
