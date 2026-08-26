import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import {
  checkAndAwardBadges,
  getUserTimezone,
  updateSpacedRepetition,
} from '@/lib/badges';
import { getChallengeDifficulty } from '@/lib/challenge-lookup';
import { prisma } from '@/lib/prisma';
import { updatePersonalBest } from '@/lib/personal-bests';
import { recordPathItemAttempt } from '@/lib/paths/progress';
import { inferPathItemType } from '@/lib/paths/infer-item-type';
import { updateStreak } from '@/lib/streak';
import { updateWeakSpot } from '@/lib/weak-spots';

const attemptSchema = z.object({
  challengeId: z.string().min(1),
  challengeType: z.enum(['be', 'fe', 'fe-advanced', 'nextjs', 'be-question', 'fe-question', 'nextjs-question']),
  language: z.enum(['javascript', 'typescript']).optional().default('typescript'),
  code: z.string().optional(),
  answer: z.string().optional(),
  passed: z.boolean(),
  timeSpentMs: z.number().int().nonnegative().optional(),
  aiCoachUsed: z.boolean().optional().default(false),
  aiReviewUsed: z.boolean().optional().default(false),
  aiImproveUsed: z.boolean().optional().default(false),
  hintUsed: z.boolean().optional().default(false),
  trackingOnly: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = attemptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);

  if (!email) {
    return NextResponse.json(
      { error: 'User email not found — complete sign-in with Google or email first' },
      { status: 400 }
    );
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.id,
      challengeId: parsed.data.challengeId,
      challengeType: parsed.data.challengeType,
      language: parsed.data.language ?? 'typescript',
      code: parsed.data.code,
      answer: parsed.data.answer,
      passed: parsed.data.passed,
      timeSpentMs: parsed.data.timeSpentMs,
      aiCoachUsed: parsed.data.aiCoachUsed,
      aiReviewUsed: parsed.data.aiReviewUsed,
      aiImproveUsed: parsed.data.aiImproveUsed,
      hintUsed: parsed.data.hintUsed,
    },
  });

  if (
    parsed.data.passed &&
    parsed.data.timeSpentMs &&
    ['be', 'fe', 'fe-advanced', 'nextjs'].includes(parsed.data.challengeType)
  ) {
    await updatePersonalBest(
      user.id,
      parsed.data.challengeId,
      parsed.data.timeSpentMs,
      true
    );
  }

  const timezone = await getUserTimezone(user.id);
  const difficulty = getChallengeDifficulty(parsed.data.challengeId, parsed.data.challengeType);

  // Skip streak/badge side effects for AI-only tracking records
  if (parsed.data.trackingOnly) {
    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      trackingOnly: true,
    });
  }

  const [streak] = await Promise.all([
    updateStreak(user.id, timezone),
    updateSpacedRepetition(
      user.id,
      parsed.data.challengeId,
      parsed.data.challengeType,
      difficulty,
      parsed.data.passed
    ),
    updateWeakSpot(user.id, parsed.data.challengeId, parsed.data.passed),
    recordPathItemAttempt(
      user.id,
      parsed.data.challengeId,
      inferPathItemType(parsed.data.challengeId),
      parsed.data.passed
    ),
  ]);

  const newBadges = await checkAndAwardBadges(user.id);

  return NextResponse.json({
    success: true,
    attemptId: attempt.id,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    newBadges,
  });
}
