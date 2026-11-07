import { buildTrayCounts } from '@/features/diary/trayCounts';

describe('buildTrayCounts', () => {
  it('keeps owned stickers available after they are placed', () => {
    const tray = buildTrayCounts(
      [
        { stickerId: 'common-gold-star' },
        { stickerId: 'common-gold-star' },
        { stickerId: 'rare-holo-cd' },
      ],
      [{ stickerId: 'common-gold-star' }],
      [{ stickerId: 'common-gold-star' }],
    );

    expect(tray).toEqual([
      { id: 'common-gold-star', count: 2, placed: true },
      { id: 'rare-holo-cd', count: 1, placed: false },
    ]);
  });

  it('still offers a sticker that is already on the page', () => {
    const tray = buildTrayCounts(
      [{ stickerId: 'common-lil-cloud' }],
      [{ stickerId: 'common-lil-cloud' }],
      [{ stickerId: 'common-lil-cloud' }],
    );
    expect(tray[0]).toEqual({ id: 'common-lil-cloud', count: 1, placed: true });
  });
});
