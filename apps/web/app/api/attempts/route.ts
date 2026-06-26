import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { computeStreak } from '@/lib/streak';

const attemptSchema = z.object({
  challengeId: z.string().min(1),
  challengeType: z.enum(['be', 'fe', 'fe-advanced', 'be-question', 'fe-question']),
  language: z.enum(['javascript', 'typescript']),
  code: z.string().optional(),
  passed: z.boolean(),
  timeSpentMs: z.number().int().nonnegative().optional(),
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
      language: parsed.data.language,
      code: parsed.data.code,
      passed: parsed.data.passed,
      timeSpentMs: parsed.data.timeSpentMs,
    },
  });

  // Compute updated streak so client can do an optimistic update without a re-fetch
  const allAttempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    select: { createdAt: true },
  });
  const { currentStreak } = computeStreak(allAttempts.map((a) => a.createdAt));

  return NextResponse.json({ success: true, attemptId: attempt.id, currentStreak });
}
