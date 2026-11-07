export type ExportItemRow = {
  id: string;
  kind: string;
  name: string;
  amountCents: number | null;
  currency: string;
  note: string | null;
  photoPath: string | null;
  tag: string | null;
  boughtAfterAllAt: string | null;
  happenedAt: string;
};

export type ExportDiaryRow = {
  id: string;
  entryDate: string;
  promptId: string | null;
  mood: string | null;
  body: string;
};

function csvCell(value: string | number | null): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function csvTable(headers: string[], rows: (string | number | null)[][]): string {
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(row.map(csvCell).join(','));
  return `${lines.join('\n')}\n`;
}

export function itemsToCsv(rows: ExportItemRow[]): string {
  return csvTable(
    [
      'id',
      'kind',
      'name',
      'amount_cents',
      'currency',
      'note',
      'photo_path',
      'tag',
      'bought_after_all_at',
      'happened_at',
    ],
    rows.map((row) => [
      row.id,
      row.kind,
      row.name,
      row.amountCents,
      row.currency,
      row.note,
      row.photoPath,
      row.tag,
      row.boughtAfterAllAt,
      row.happenedAt,
    ]),
  );
}

export function diaryToCsv(rows: ExportDiaryRow[]): string {
  return csvTable(
    ['id', 'entry_date', 'prompt_id', 'mood', 'body'],
    rows.map((row) => [row.id, row.entryDate, row.promptId, row.mood, row.body]),
  );
}
