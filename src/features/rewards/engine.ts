import type { StickerId } from '@/components/stickerAssets';
import { dayKey } from '@/lib/dates';

export type RandomSource = () => number;

export type QuestId =
  'diary_line' | 'first_diary_line' | 'add_sticker' | 'log_loved' | 'peek_tally' | 'pick_mood';

export const QUEST_COPY: Record<QuestId, string> = {
  diary_line: 'write one line in ur diary',
  first_diary_line: 'write ur first diary line',
  add_sticker: 'add a sticker to a page',
  log_loved: 'log a loved thing',
  peek_tally: 'peek at ur tally',
  pick_mood: 'pick a mood for today',
};

const ROTATING_QUESTS: QuestId[] = [
  'diary_line',
  'add_sticker',
  'log_loved',
  'peek_tally',
  'pick_mood',
];

export const STARTER_COMMON: StickerId[] = [
  'common-butterfly',
  'common-dear-wallet-letter',
  'common-flip-phone',
  'common-gold-star',
  'common-kept-stack',
  'common-lil-cloud',
  'common-lip-gloss',
  'common-mixtape',
  'common-nvm-bubble',
  'common-nvmd-boba',
  'common-pixel-heart',
  'common-sparkle-trio',
];

export const STARTER_RARE: StickerId[] = ['rare-holo-butterfly', 'rare-holo-cd', 'rare-holo-star'];

/** One star per local calendar day. Pure: returns whether a new star should be awarded. */
export function shouldAwardStar(existingDayKeys: string[], at: Date = new Date()): boolean {
  return !existingDayKeys.includes(dayKey(at));
}

/**
 * Sticker drop: base 1 in 3. Pity: after 3 empty actions the 4th always drops.
 * On drop: 90% common, 10% rare. Injectable random in [0, 1).
 */
export function rollSticker(
  emptyStreak: number,
  random: RandomSource = Math.random,
  commons: StickerId[] = STARTER_COMMON,
  rares: StickerId[] = STARTER_RARE,
): { stickerId: StickerId | null; rare: boolean; nextEmptyStreak: number } {
  const forceDrop = emptyStreak >= 3;
  const drops = forceDrop || random() < 1 / 3;

  if (!drops) {
    return { stickerId: null, rare: false, nextEmptyStreak: emptyStreak + 1 };
  }

  const rare = random() < 0.1;
  const pool = rare ? rares : commons;
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  const stickerId = pool[index] ?? commons[0] ?? null;

  return {
    stickerId,
    rare: rare && stickerId !== null && stickerId.startsWith('rare-'),
    nextEmptyStreak: 0,
  };
}

/** Deterministic daily quest from day key + user id. First day always first_diary_line. */
export function pickDailyQuest(day: string, userId: string, isFirstDay: boolean): QuestId {
  if (isFirstDay) return 'first_diary_line';

  let hash = 0;
  const seed = `${day}:${userId}`;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ROTATING_QUESTS[hash % ROTATING_QUESTS.length] ?? 'diary_line';
}
