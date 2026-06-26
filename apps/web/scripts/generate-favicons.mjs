import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const svg = fs.readFileSync(path.join(publicDir, 'favicon.svg'));

await sharp(svg).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
await sharp(svg).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
await sharp(svg).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

console.log('✅ Favicons generated: favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png');
