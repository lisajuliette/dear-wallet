import { parsePadInput } from '@/lib/money';

export type LogKind = 'kept' | 'loved';

/** Enable rules for Quick log: kept needs amount + name; loved needs name. */
export function canSaveLog(kind: LogKind, amountText: string, name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length === 0) return false;
  if (kind === 'loved') return true;
  return parsePadInput(amountText) !== null;
}
