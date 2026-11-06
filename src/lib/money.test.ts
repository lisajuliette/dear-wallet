import { formatCents, parsePadInput } from './money';

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

  it('uses the USD symbol by default', () => {
    expect(formatCents(99, 'USD')).toBe('$0.99');
  });
});

describe('parsePadInput', () => {
  it('parses whole dollars to cents', () => {
    expect(parsePadInput('12')).toBe(1200);
  });

  it('parses one and two decimal places', () => {
    expect(parsePadInput('12.3')).toBe(1230);
    expect(parsePadInput('12.34')).toBe(1234);
  });

  it('rejects empty, trailing-dot and invalid strings', () => {
    expect(parsePadInput('')).toBeNull();
    expect(parsePadInput('.')).toBeNull();
    expect(parsePadInput('0.')).toBeNull();
    expect(parsePadInput('12.')).toBeNull();
    expect(parsePadInput('12.345')).toBeNull();
    expect(parsePadInput('abc')).toBeNull();
  });

  it('parses zero dollars with cents', () => {
    expect(parsePadInput('0.5')).toBe(50);
    expect(parsePadInput('0.05')).toBe(5);
  });
});
