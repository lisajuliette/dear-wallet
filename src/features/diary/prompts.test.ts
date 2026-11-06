import { DIARY_PROMPTS, pickPrompt, recentPromptIds } from '@/features/diary/prompts';

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
