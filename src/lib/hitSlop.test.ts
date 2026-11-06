import { hitSlopForSize } from './hitSlop';

describe('hitSlopForSize', () => {
  it('returns zero when the control is already 44 × 44', () => {
    expect(hitSlopForSize(44, 44)).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });

  it('pads a 24 × 24 control to reach 44 × 44', () => {
    expect(hitSlopForSize(24, 24)).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });

  it('pads only the short axis for a wide control', () => {
    expect(hitSlopForSize(80, 36)).toEqual({ top: 4, bottom: 4, left: 0, right: 0 });
  });
});
