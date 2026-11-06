/** Formats integer cents as a display string. Full currency rules arrive in a later step. */
export function formatCents(cents: number): string {
  const absolute = Math.abs(cents);
  const dollars = Math.floor(absolute / 100);
  const remainder = absolute % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars}.${remainder.toString().padStart(2, '0')}`;
}
