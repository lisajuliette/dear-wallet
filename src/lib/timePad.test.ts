import { applyTimeKey, formatTimeEntry, timeEntryParts } from '@/lib/timePad';

describe('time pad', () => {
  it('types 7:30 without a colon', () => {
    let value = '';
    for (const key of ['7', '3', '0'] as const) value = applyTimeKey(value, key);
    expect(value).toBe('7:30');
    expect(timeEntryParts(value)).toEqual({ hour12: 7, minute: 30 });
    expect(formatTimeEntry(value)).toEqual({ hour: '7', minute: '30' });
  });

  it('types 10:15 and 1:05', () => {
    let ten = '';
    for (const key of ['1', '0', '1', '5'] as const) ten = applyTimeKey(ten, key);
    expect(ten).toBe('10:15');
    expect(timeEntryParts(ten)).toEqual({ hour12: 10, minute: 15 });

    let one = '';
    for (const key of ['1', '.', '0', '5'] as const) one = applyTimeKey(one, key);
    expect(one).toBe('1:05');
    expect(timeEntryParts(one)).toEqual({ hour12: 1, minute: 5 });
  });

  it('rejects a minute past 59 and extra digits', () => {
    expect(applyTimeKey('7:', '6')).toBe('7:');
    expect(applyTimeKey('7:30', '1')).toBe('7:30');
    expect(applyTimeKey('7:3', 'back')).toBe('7:');
  });

  it('keeps an unfinished minute visible', () => {
    expect(formatTimeEntry('7:3')).toEqual({ hour: '7', minute: '3–' });
    expect(timeEntryParts('7:3')).toEqual({ hour12: 7, minute: 30 });
    expect(timeEntryParts('10')).toEqual({ hour12: 10, minute: 0 });
  });
});
