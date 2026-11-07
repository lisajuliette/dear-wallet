import type { PadKey } from '@/lib/amountPad';

/**
 * Keystrokes for a 12-hour time.
 * 2–9 lock the hour. 1 can grow into 10, 11, or 12.
 * The decimal key is the colon. A third digit after 10–12 starts the minutes.
 */
export function applyTimeKey(current: string, key: PadKey): string {
  if (key === 'back') return current.slice(0, -1);
  if (key === '.') {
    if (current.length === 0 || current.includes(':')) return current;
    const hour = Number(current);
    if (hour < 1 || hour > 12) return current;
    return `${hour}:`;
  }
  if (!/^\d$/.test(key)) return current;

  const colon = current.indexOf(':');
  if (colon === -1) {
    if (current.length === 0) {
      if (key === '0') return current;
      return key >= '2' ? `${key}:` : key;
    }
    if (current === '1' && (key === '0' || key === '1' || key === '2')) return `1${key}`;
    if (current === '1') return `1:${key}`;
    if (current.length === 2) return `${Number(current)}:${key}`;
    return current;
  }

  const minutes = current.slice(colon + 1);
  if (minutes.length >= 2) return current;
  if (minutes.length === 0 && Number(key) > 5) return current;
  return `${current}${key}`;
}

export function timeEntryParts(current: string): { hour12: number; minute: number } | null {
  if (!current) return null;
  const [hourText, minuteText = ''] = current.split(':');
  const hour12 = Number(hourText);
  if (!Number.isInteger(hour12) || hour12 < 1 || hour12 > 12) return null;
  if (!current.includes(':') || minuteText.length === 0) return { hour12, minute: 0 };
  const minute = Number(minuteText.padEnd(2, '0'));
  if (!Number.isInteger(minute) || minute > 59) return null;
  return { hour12, minute };
}

/** Hour and minute text for the display. Missing digits stay as dashes. */
export function formatTimeEntry(current: string): { hour: string; minute: string } {
  const [hourText = '', minuteText = ''] = current.split(':');
  const minute = current.includes(':') ? `${minuteText}––`.slice(0, 2) : '––';
  return { hour: hourText || '–', minute };
}
