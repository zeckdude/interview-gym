#!/usr/bin/env node
/**
 * Reports content counts per taxonomy bucket and difficulty vs launch minimums.
 */
import fs from 'fs';
import path from 'path';

const MIN = 10;
const DIFFS = ['easy', 'intermediate', 'advanced'];

const ROOT = path.resolve('apps/web/data/challenges');

const TAXONOMY_RULES = [
  { key: 'be', match: (id) => /^be-/.test(id) },
  { key: 'fe', match: (id) => /^fe-/.test(id) && !/^fea-/.test(id) },
  { key: 'fe:react', match: (id) => /^fea-/.test(id) },
  { key: 'fe:nextjs', match: (id) => /^nj-/.test(id) },
  { key: 'fe:css', match: (id) => /^css-/.test(id) },
  { key: 'fe:ai', match: (id) => /^ai-/.test(id) },
  { key: 'stack:typescript', match: (id) => /^ts-/.test(id) },
  { key: 'stack:vitest', match: (id) => /^vt-/.test(id) },
];

function readChallengeMeta(dir) {
  const indexPath = path.join(ROOT, dir, 'index.ts');
  const src = fs.readFileSync(indexPath, 'utf8');
  const id = src.match(/id:\s*'([^']+)'/)?.[1];
  const difficulty = src.match(/difficulty:\s*'([^']+)'/)?.[1];
  const comingSoon = /comingSoon:\s*true/.test(src);
  return { id, difficulty, comingSoon };
}

const buckets = Object.fromEntries(TAXONOMY_RULES.map((r) => [r.key, { easy: 0, intermediate: 0, advanced: 0 }]));

for (const dir of fs.readdirSync(ROOT)) {
  const indexPath = path.join(ROOT, dir, 'index.ts');
  if (!fs.existsSync(indexPath)) continue;
  const meta = readChallengeMeta(dir);
  if (!meta.id || meta.comingSoon) continue;
  const rule = TAXONOMY_RULES.find((r) => r.match(meta.id));
  if (!rule || !meta.difficulty) continue;
  buckets[rule.key][meta.difficulty] += 1;
}

console.log('Content audit — challenges per bucket (target: 10/10/10):\n');
for (const [key, counts] of Object.entries(buckets)) {
  const total = counts.easy + counts.intermediate + counts.advanced;
  const gaps = DIFFS.map((d) => Math.max(0, MIN - counts[d]));
  const status = gaps.every((g) => g === 0) ? '✅' : '⚠️';
  console.log(
    `${status} ${key.padEnd(18)} easy=${String(counts.easy).padStart(2)} int=${String(counts.intermediate).padStart(2)} adv=${String(counts.advanced).padStart(2)} total=${total}`
  );
  if (gaps.some((g) => g > 0)) {
    console.log(`     gaps: ${DIFFS.map((d, i) => (gaps[i] ? `${d}+${gaps[i]}` : null)).filter(Boolean).join(', ')}`);
  }
}
