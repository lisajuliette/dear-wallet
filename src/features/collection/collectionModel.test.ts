import {
  albumOwnedCount,
  buildAlbumSlots,
  buildMilestoneBadges,
  buildPackCards,
} from '@/features/collection/collectionModel';
import { ALBUM_SLOT_COUNT } from '@/features/rewards/packs';

describe('collectionModel', () => {
  it('builds 24 album slots', () => {
    const slots = buildAlbumSlots(['common-gold-star']);
    expect(slots).toHaveLength(ALBUM_SLOT_COUNT);
    expect(albumOwnedCount(slots)).toBe(1);
  });

  it('marks next milestone with percent', () => {
    const badges = buildMilestoneBadges(new Set(['first_nvm']), {
      keptTotalCents: 5_000,
      keptLogCount: 1,
      diaryTextCount: 0,
    });
    expect(badges.some((b) => b.state === 'done')).toBe(true);
    expect(badges.some((b) => b.state === 'next' && b.pct === '50%')).toBe(true);
  });

  it('locks y2k desk until unlock', () => {
    const packs = buildPackCards([], {
      keptTotalCents: 10_000,
      keptLogCount: 2,
      diaryTextCount: 0,
    });
    const desk = packs.find((p) => p.id === 'y2k_desk');
    expect(desk?.locked).toBe(true);
    expect(desk?.progress).toBeCloseTo(0.2);
  });
});
