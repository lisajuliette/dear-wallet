export type CurrencyCode = 'USD';

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
};

/** Formats integer cents as a display string for the given currency. */
export function formatCents(cents: number, currency: CurrencyCode = 'USD'): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? '$';
  const absolute = Math.abs(cents);
  const dollars = Math.floor(absolute / 100);
  const remainder = absolute % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}${symbol}${dollars}.${remainder.toString().padStart(2, '0')}`;
}

/**
 * Parses AmountPad input ("12", "12.", "12.3", "12.34") into integer cents.
 * Returns null for empty / incomplete / invalid values.
 */
export function parsePadInput(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed === '.' || trimmed === '0.') return null;

  if (!/^\d{1,6}(\.\d{0,2})?$/.test(trimmed)) return null;

  const [integerPart = '0', fractionPart = ''] = trimmed.split('.');
  if (trimmed.includes('.') && fractionPart.length === 0) return null;

  const dollars = Number.parseInt(integerPart, 10);
  const cents = Number.parseInt(fractionPart.padEnd(2, '0').slice(0, 2) || '0', 10);
  if (!Number.isFinite(dollars) || !Number.isFinite(cents)) return null;

  return dollars * 100 + cents;
}
