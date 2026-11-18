// Converts everything in /pictures into compressed WebP files in /public/photos
// named 01.webp, 02.webp, ... (sorted by filename). Run: npm run photos
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'pictures';
const OUT = 'public/photos';
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp|heic|avif)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let i = 0;
for (const f of files) {
  i++;
  const name = String(i).padStart(2, '0') + '.webp';
  const info = await sharp(join(SRC, f))
    .rotate() // respect EXIF orientation
    .resize({ width: 900, height: 900, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(OUT, name));
  console.log(`${f}  ->  ${name}  (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}
console.log(`\nDone: ${i} photos. List them in src/content.js -> photos[] as 'photos/01.webp' etc.`);
