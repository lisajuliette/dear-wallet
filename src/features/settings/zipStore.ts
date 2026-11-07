export type ZipEntry = {
  name: string;
  data: Uint8Array;
};

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i] ?? 0;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function u32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

/** ZIP archive stored uncompressed. Photos are already compressed. */
export function buildStoredZip(entries: ZipEntry[]): Uint8Array {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = new TextEncoder().encode(entry.name);
    const crc = crc32(entry.data);
    const local = new Uint8Array(30 + name.length + entry.data.length);
    const view = new DataView(local.buffer);
    u32(view, 0, 0x04034b50);
    u16(view, 4, 20);
    u16(view, 8, 0);
    u32(view, 14, crc);
    u32(view, 18, entry.data.length);
    u32(view, 22, entry.data.length);
    u16(view, 26, name.length);
    local.set(name, 30);
    local.set(entry.data, 30 + name.length);
    locals.push(local);

    const central = new Uint8Array(46 + name.length);
    const cd = new DataView(central.buffer);
    u32(cd, 0, 0x02014b50);
    u16(cd, 4, 20);
    u16(cd, 6, 20);
    u32(cd, 16, crc);
    u32(cd, 20, entry.data.length);
    u32(cd, 24, entry.data.length);
    u16(cd, 28, name.length);
    u32(cd, 42, offset);
    central.set(name, 46);
    centrals.push(central);
    offset += local.length;
  }

  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const eocd = new DataView(end.buffer);
  u32(eocd, 0, 0x06054b50);
  u16(eocd, 8, entries.length);
  u16(eocd, 10, entries.length);
  u32(eocd, 12, centralSize);
  u32(eocd, 16, offset);

  const out = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const part of [...locals, ...centrals, end]) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return out;
}

export function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i] ?? 0);
  return btoa(binary);
}

export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
