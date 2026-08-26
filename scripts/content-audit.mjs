#!/usr/bin/env node
/**
 * Reports content counts per taxonomy bucket and difficulty vs launch minimums.
 */
import fs from 'fs';
import path from 'path';

const MIN = 10;
const DIFFS = ['easy', 'intermediate', 'advanced'];

const ROOT = path.resolve('apps/web/data/challenges');

function readChallengeMeta(dir) {
  const indexPath = path.join(ROOT, dir, 'index.ts');
  const src = fs.readFileSync(indexPath, 'utf8');
  const id = src.match(/id:\s*'([^']+)'/)?.[1];
  const difficulty = src.match(/difficulty:\s*'([^']+)'/)?.[1];
  const comingSoon = /comingSoon:\s*true/.test(src);
  const topLevel = src.match(/topLevel:\s*'([^']+)'/)?.[1];
  const subcategory = src.match(/subcategory:\s*'([^']+)'/)?.[1] ?? null;
  return { id, difficulty, comingSoon, topLevel, subcategory };
}

function bucketKey(topLevel, subcategory) {
  return subcategory ? `${topLevel}:${subcategory}` : topLevel;
}

const buckets = {};

for (const dir of fs.readdirSync(ROOT)) {
  const indexPath = path.join(ROOT, dir, 'index.ts');
  if (!fs.existsSync(indexPath)) continue;
  const meta = readChallengeMeta(dir);
  if (!meta.id || meta.comingSoon || !meta.difficulty || !meta.topLevel) continue;
  const key = bucketKey(meta.topLevel, meta.subcategory);
  if (!buckets[key]) buckets[key] = { easy: 0, intermediate: 0, advanced: 0 };
  buckets[key][meta.difficulty] += 1;
}

console.log('Content audit — challenges per bucket (target: 10/10/10):\n');
for (const [key, counts] of Object.entries(buckets).sort()) {
  const total = counts.easy + counts.intermediate + counts.advanced;
  const gaps = DIFFS.map((d) => Math.max(0, MIN - counts[d]));
  const status = gaps.every((g) => g === 0) ? '✅' : '⚠️';
  console.log(
    `${status} ${key.padEnd(22)} easy=${String(counts.easy).padStart(2)} int=${String(counts.intermediate).padStart(2)} adv=${String(counts.advanced).padStart(2)} total=${total}`
  );
  if (gaps.some((g) => g > 0)) {
    console.log(`     gaps: ${DIFFS.map((d, i) => (gaps[i] ? `${d}+${gaps[i]}` : null)).filter(Boolean).join(', ')}`);
  }
}
