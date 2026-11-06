import { applyPadKey } from '@/lib/amountPad';

describe('applyPadKey', () => {
  it('appends digits', () => {
    expect(applyPadKey('', '1')).toBe('1');
    expect(applyPadKey('1', '2')).toBe('12');
  });

  it('replaces a lone leading zero', () => {
    expect(applyPadKey('0', '5')).toBe('5');
  });

  it('starts a decimal from empty or integer', () => {
    expect(applyPadKey('', '.')).toBe('0.');
    expect(applyPadKey('12', '.')).toBe('12.');
  });

  it('allows only one decimal point', () => {
    expect(applyPadKey('12.', '.')).toBe('12.');
    expect(applyPadKey('12.3', '.')).toBe('12.3');
  });

  it('caps fraction digits at two', () => {
    expect(applyPadKey('12.3', '4')).toBe('12.34');
    expect(applyPadKey('12.34', '5')).toBe('12.34');
  });

  it('caps integer digits at six', () => {
    expect(applyPadKey('123456', '7')).toBe('123456');
    expect(applyPadKey('12345', '6')).toBe('123456');
  });

  it('deletes with back', () => {
    expect(applyPadKey('12.3', 'back')).toBe('12.');
    expect(applyPadKey('1', 'back')).toBe('');
    expect(applyPadKey('', 'back')).toBe('');
  });
});
