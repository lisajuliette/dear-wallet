import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS_DIR = join(__dirname);
const HEX = /#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/;
/** Sticker asset maps may mention rare art; hex belongs in theme + SVG assets only. */
const ALLOWED = new Set(['stickerAssets.ts', 'noHexColors.test.ts']);

describe('component colour tokens', () => {
  it('does not hard-code hex colours outside sticker asset files', () => {
    const files = readdirSync(COMPONENTS_DIR).filter(
      (name: string) => /\.(ts|tsx)$/.test(name) && !ALLOWED.has(name),
    );

    const offenders: string[] = [];
    for (const name of files) {
      const source = readFileSync(join(COMPONENTS_DIR, name), 'utf8');
      if (HEX.test(source)) {
        offenders.push(name);
      }
    }

    expect(offenders).toEqual([]);
  });
});
