import {
  DIARY_PROMPTS,
  loadShuffleHistory,
  pickPrompt,
  recentPromptIds,
  rememberPrompt,
} from '@/features/diary/prompts';

describe('diary prompts', () => {
  it('avoids prompts used in the last 7 days', () => {
    const at = new Date(2026, 10, 10);
    const history = DIARY_PROMPTS.slice(0, 6).map((p, i) => ({
      promptId: p.id,
      usedAt: new Date(2026, 10, 10 - i).toISOString(),
    }));

    expect(recentPromptIds(history, at).size).toBe(6);
    expect(pickPrompt(history, at, () => 0).id).toBe(DIARY_PROMPTS[6]?.id);
  });

  it('does not repeat a prompt while shuffling through the last 7 days', () => {
    const at = new Date(2026, 10, 10);
    const seen: string[] = [];
    let history: { promptId: string; usedAt: string }[] = [];
    for (let i = 0; i < DIARY_PROMPTS.length; i += 1) {
      const next = pickPrompt(history, at, () => 0, seen[seen.length - 1]);
      expect(seen).not.toContain(next.id);
      seen.push(next.id);
      history = [...history, { promptId: next.id, usedAt: at.toISOString() }];
    }
    expect(new Set(seen).size).toBe(DIARY_PROMPTS.length);
  });

  it('falls back when every prompt was used recently', () => {
    const at = new Date(2026, 10, 10);
    const history = DIARY_PROMPTS.map((p) => ({
      promptId: p.id,
      usedAt: at.toISOString(),
    }));
    const picked = pickPrompt(history, at, () => 0.99, DIARY_PROMPTS[0]?.id);
    expect(picked.id).not.toBe(DIARY_PROMPTS[0]?.id);
  });
});

describe('rememberPrompt', () => {
  it('keeps a shuffled prompt in the 7 day history', async () => {
    await rememberPrompt('wallet_feeling', new Date(2026, 10, 7, 12));
    const history = await loadShuffleHistory();
    expect(history.some((row) => row.promptId === 'wallet_feeling')).toBe(true);
    const next = pickPrompt(history, new Date(2026, 10, 7), () => 0, 'wallet_feeling');
    expect(next.id).not.toBe('wallet_feeling');
  });
});
