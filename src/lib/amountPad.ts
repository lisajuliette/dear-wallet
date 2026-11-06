export type PadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back';

const MAX_INTEGER_DIGITS = 6;
const MAX_FRACTION_DIGITS = 2;

/** Pure AmountPad input rules: one decimal, capped digits, backspace. */
export function applyPadKey(current: string, key: PadKey): string {
  if (key === 'back') {
    return current.slice(0, -1);
  }

  if (key === '.') {
    if (current.includes('.')) return current;
    if (current.length === 0) return '0.';
    return `${current}.`;
  }

  const [integerPart = '', fractionPart] = current.split('.');
  const hasDecimal = current.includes('.');

  if (hasDecimal) {
    if ((fractionPart?.length ?? 0) >= MAX_FRACTION_DIGITS) return current;
    return `${current}${key}`;
  }

  if (integerPart.replace(/^0+/, '').length >= MAX_INTEGER_DIGITS && integerPart !== '0') {
    return current;
  }

  if (integerPart === '0') {
    return key;
  }

  return `${current}${key}`;
}
