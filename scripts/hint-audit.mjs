#!/usr/bin/env node
/**
 * Learn path hint health audit — run after Phase 1 has collected events.
 *
 * Usage: npm run hint:audit
 * Requires DATABASE_URL in .env.local (same as db:migrate).
 */
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
config({ path: path.join(ROOT, '.env.local') });

const PHASE2_MISMATCH = 0.4;
const PHASE2_REVEAL = 0.25;
const PHASE2_ALL_HINTS = 0.5;
const PHASE3_MISMATCH = 0.3;
const PHASE3_REVEAL = 0.15;

const prisma = new PrismaClient();

function pct(n, total) {
  if (total === 0) return 0;
  return n / total;
}

function fmtPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL — run npm run setup and ensure .env.local exists.');
    process.exit(1);
  }

  let totalEvents = 0;
  try {
    totalEvents = await prisma.learnHintEvent.count();
  } catch (err) {
    if (err?.code === 'P2021') {
      console.log('Learn hint audit — LearnHintEvent table not found.\n');
      console.log('Run: npm run db:migrate');
      console.log('Then re-run: npm run hint:audit\n');
      await prisma.$disconnect();
      return;
    }
    throw err;
  }

  if (totalEvents === 0) {
    console.log('Learn hint audit — no events logged yet.\n');
    console.log('Phase 1 is deployed but waiting for learner data.');
    console.log('Re-run after ~2 weeks of learn-path usage or ~50+ signed-in learners.\n');
    await prisma.$disconnect();
    return;
  }

  const wrongAttempts = await prisma.learnHintEvent.findMany({
    where: { eventType: 'wrong_attempt' },
    select: {
      stepId: true,
      moduleId: true,
      mistakeKind: true,
      hintsShown: true,
      revealed: true,
    },
  });

  const reveals = await prisma.learnHintEvent.findMany({
    where: { eventType: 'reveal' },
    select: { stepId: true },
  });

  const revealByStep = new Map();
  for (const r of reveals) {
    revealByStep.set(r.stepId, (revealByStep.get(r.stepId) ?? 0) + 1);
  }

  const byStep = new Map();
  for (const row of wrongAttempts) {
    if (!byStep.has(row.stepId)) {
      byStep.set(row.stepId, {
        stepId: row.stepId,
        moduleId: row.moduleId,
        wrong: 0,
        mismatch: 0,
        allHints: 0,
      });
    }
    const bucket = byStep.get(row.stepId);
    bucket.wrong += 1;
    if (row.mistakeKind === 'output_mismatch' || !row.mistakeKind) {
      bucket.mismatch += 1;
    }
    if (row.hintsShown >= 3) bucket.allHints += 1;
  }

  const stepStats = [...byStep.values()].sort((a, b) => b.wrong - a.wrong);
  let globalMismatch = 0;
  let globalReveal = 0;
  const phase2Steps = [];

  console.log('Learn hint audit\n');
  console.log(`Total events: ${totalEvents}`);
  console.log(`Wrong attempts: ${wrongAttempts.length}\n`);
  console.log('Per-step breakdown (Phase 2 candidates marked ⚠️):\n');

  for (const s of stepStats) {
    const mismatchRate = pct(s.mismatch, s.wrong);
    const revealRate = pct(revealByStep.get(s.stepId) ?? 0, s.wrong);
    const allHintsRate = pct(s.allHints, s.wrong);

    globalMismatch += s.mismatch;
    globalReveal += revealByStep.get(s.stepId) ?? 0;

    const needsPhase2 =
      mismatchRate >= PHASE2_MISMATCH ||
      revealRate >= PHASE2_REVEAL ||
      allHintsRate >= PHASE2_ALL_HINTS;

    if (needsPhase2) {
      phase2Steps.push({
        stepId: s.stepId,
        mismatchRate,
        revealRate,
        allHintsRate,
      });
    }

    const flag = needsPhase2 ? '⚠️' : '✅';
    console.log(
      `${flag} ${s.stepId.padEnd(12)} wrong=${String(s.wrong).padStart(3)}  mismatch=${fmtPct(mismatchRate).padStart(6)}  reveal=${fmtPct(revealRate).padStart(6)}  allHints=${fmtPct(allHintsRate).padStart(6)}`
    );
  }

  const globalMismatchRate = pct(globalMismatch, wrongAttempts.length);
  const globalRevealRate = pct(globalReveal, wrongAttempts.length);

  console.log('\nGlobal summary:');
  console.log(`  output_mismatch rate: ${fmtPct(globalMismatchRate)} (Phase 3 threshold: ${fmtPct(PHASE3_MISMATCH)})`);
  console.log(`  reveal rate:          ${fmtPct(globalRevealRate)} (Phase 3 threshold: ${fmtPct(PHASE3_REVEAL)})`);

  console.log('\nRecommendations:\n');

  if (phase2Steps.length === 0) {
    console.log('  Phase 2: No steps need mistakeHints branches yet. Keep monitoring.');
  } else {
    console.log(`  Phase 2: Add mistakeHints for ${phase2Steps.length} step(s):`);
    for (const s of phase2Steps.slice(0, 10)) {
      const reasons = [];
      if (s.mismatchRate >= PHASE2_MISMATCH) reasons.push(`mismatch ${fmtPct(s.mismatchRate)}`);
      if (s.revealRate >= PHASE2_REVEAL) reasons.push(`reveal ${fmtPct(s.revealRate)}`);
      if (s.allHintsRate >= PHASE2_ALL_HINTS) reasons.push(`allHints ${fmtPct(s.allHintsRate)}`);
      console.log(`    • ${s.stepId} — ${reasons.join(', ')}`);
    }
    if (phase2Steps.length > 10) {
      console.log(`    … and ${phase2Steps.length - 10} more`);
    }
  }

  const needsPhase3 =
    globalMismatchRate >= PHASE3_MISMATCH || globalRevealRate >= PHASE3_REVEAL;

  if (needsPhase3) {
    console.log('\n  Phase 3: Consider enabling optional AI tutor fallback on learn pages.');
    if (globalMismatchRate >= PHASE3_MISMATCH) {
      console.log(`    • Global mismatch ${fmtPct(globalMismatchRate)} exceeds ${fmtPct(PHASE3_MISMATCH)}`);
    }
    if (globalRevealRate >= PHASE3_REVEAL) {
      console.log(`    • Global reveal ${fmtPct(globalRevealRate)} exceeds ${fmtPct(PHASE3_REVEAL)}`);
    }
  } else {
    console.log('\n  Phase 3: Not needed yet — rules + routing are doing their job.');
  }

  console.log('\nSee phases/PHASE-LEARN-HINTS.md for full threshold reference.\n');

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
