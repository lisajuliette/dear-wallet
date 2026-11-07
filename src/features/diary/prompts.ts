import AsyncStorage from '@react-native-async-storage/async-storage';

export type DiaryPrompt = {
  id: string;
  text: string;
};

/** COPY.md diary prompts. */
export const DIARY_PROMPTS: readonly DiaryPrompt[] = [
  { id: 'wallet_feeling', text: "how's ur wallet feeling today?" },
  { id: 'almost_tempted', text: 'what almost tempted u this week?' },
  { id: 'loved_free', text: 'one thing u loved that cost $0?' },
  { id: 'future_u', text: 'what would future u say about today?' },
  { id: 'money_win', text: 'a money win, any size?' },
  { id: 'saving_feeling', text: 'what are u saving the feeling for?' },
  { id: 'dream_purchase', text: 'describe ur dream purchase in 3 words' },
] as const;

export type PromptHistory = { promptId: string; usedAt: string }[];

function dayMs(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Prompts used within the last 7 local days (inclusive of today). */
export function recentPromptIds(history: PromptHistory, at: Date = new Date()): Set<string> {
  const cutoff = dayMs(at) - 6 * 86_400_000;
  const recent = new Set<string>();
  for (const row of history) {
    const used = new Date(row.usedAt);
    if (dayMs(used) >= cutoff) recent.add(row.promptId);
  }
  return recent;
}

/**
 * Pick a prompt that was not used in the last 7 days.
 * If every prompt was used, fall back to the least-recently used.
 */
export function pickPrompt(
  history: PromptHistory,
  at: Date = new Date(),
  random: () => number = Math.random,
  avoidId?: string | null,
): DiaryPrompt {
  const recent = recentPromptIds(history, at);
  const available = DIARY_PROMPTS.filter((p) => !recent.has(p.id) && p.id !== avoidId);
  const pool = available.length > 0 ? available : DIARY_PROMPTS.filter((p) => p.id !== avoidId);
  const choices = pool.length > 0 ? pool : [...DIARY_PROMPTS];
  const index = Math.floor(random() * choices.length) % choices.length;
  return choices[index] ?? DIARY_PROMPTS[0]!;
}

export function getPromptById(id: string | null | undefined): DiaryPrompt | null {
  if (!id) return null;
  return DIARY_PROMPTS.find((p) => p.id === id) ?? null;
}

const SHUFFLE_KEY = 'dear-wallet.prompt-shuffles';

export async function loadShuffleHistory(): Promise<PromptHistory> {
  const raw = await AsyncStorage.getItem(SHUFFLE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is PromptHistory[number] =>
        !!row &&
        typeof row === 'object' &&
        typeof (row as { promptId?: unknown }).promptId === 'string' &&
        typeof (row as { usedAt?: unknown }).usedAt === 'string',
    );
  } catch {
    return [];
  }
}

/** Remember a prompt that was shown, so the next shuffle skips it for 7 days. */
export async function rememberPrompt(id: string, at: Date = new Date()): Promise<void> {
  const history = await loadShuffleHistory();
  const next = [...history, { promptId: id, usedAt: at.toISOString() }].slice(-40);
  await AsyncStorage.setItem(SHUFFLE_KEY, JSON.stringify(next));
}
