/** Save is enabled when a mood is set or there is at least one non-whitespace character. */
export function canSaveEntry(mood: string | null | undefined, body: string): boolean {
  if (mood) return true;
  return body.trim().length > 0;
}
