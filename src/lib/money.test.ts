import { formatCents } from './money';

describe('formatCents', () => {
  it('formats whole dollars', () => {
    expect(formatCents(1000)).toBe('$10.00');
  });

  it('pads single-digit cents', () => {
    expect(formatCents(105)).toBe('$1.05');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    expect(formatCents(-250)).toBe('-$2.50');
  });
});
