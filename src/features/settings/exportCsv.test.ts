import { diaryToCsv, itemsToCsv } from '@/features/settings/exportCsv';
import { buildStoredZip, utf8Bytes } from '@/features/settings/zipStore';

describe('export csv and zip', () => {
  it('writes items and diary as csv, quoting commas', () => {
    const items = itemsToCsv([
      {
        id: 'i1',
        kind: 'kept',
        name: 'lip gloss, pink',
        amountCents: 1400,
        currency: 'USD',
        note: null,
        photoPath: 'file:///photos/i1.jpg',
        tag: null,
        boughtAfterAllAt: null,
        happenedAt: '2026-11-07T12:00:00.000Z',
      },
    ]);
    expect(items).toContain('amount_cents');
    expect(items).toContain('"lip gloss, pink"');
    expect(items).toContain('1400');

    const diary = diaryToCsv([
      {
        id: 'd1',
        entryDate: '2026-11-07',
        promptId: null,
        mood: 'chill',
        body: 'one line',
      },
    ]);
    expect(diary.startsWith('id,entry_date,prompt_id,mood,body\n')).toBe(true);
    expect(diary).toContain('one line');
  });

  it('stores csv bytes in an uncompressed zip', () => {
    const csv = utf8Bytes('hello,diary\n');
    const zip = buildStoredZip([{ name: 'diary.csv', data: csv }]);
    const text = new TextDecoder().decode(zip);
    expect(text.includes('diary.csv')).toBe(true);
    expect(text.includes('hello,diary')).toBe(true);
    expect(zip[0]).toBe(0x50);
    expect(zip[1]).toBe(0x4b);
  });
});
