import { buildTrayCounts } from '@/features/diary/trayCounts';

describe('buildTrayCounts', () => {
  it('subtracts placed stickers from awards', () => {
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
      { id: 'common-gold-star', count: 1, placed: true },
      { id: 'rare-holo-cd', count: 1, placed: false },
    ]);
  });

  it('marks fully placed stickers as placed', () => {
    const tray = buildTrayCounts(
      [{ stickerId: 'common-lil-cloud' }],
      [{ stickerId: 'common-lil-cloud' }],
      [{ stickerId: 'common-lil-cloud' }],
    );
    expect(tray[0]).toEqual({ id: 'common-lil-cloud', count: 0, placed: true });
  });
});
