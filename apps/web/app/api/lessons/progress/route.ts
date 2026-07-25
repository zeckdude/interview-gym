import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { checkAndAwardBadges } from '@/lib/badges';
import { prisma } from '@/lib/prisma';

const progressSchema = z.object({
  lessonId: z.string().min(1),
  miniChallengePassed: z.boolean(),
  timeSpentMs: z.number().int().nonnegative().optional(),
});

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      lessonProgress: {
        select: {
          lessonId: true,
          completed: true,
          miniChallengePassed: true,
          bestTimeMs: true,
          attempts: true,
          lastAttemptAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ progress: [] });
  }

  const progress = user.lessonProgress.map((p) => ({
    lessonId: p.lessonId,
    completed: p.completed,
    miniChallengePassed: p.miniChallengePassed,
    bestTimeMs: p.bestTimeMs,
    attempts: p.attempts,
    lastAttemptAt: p.lastAttemptAt?.toISOString() ?? null,
  }));

  return NextResponse.json({ progress });
}

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

  const parsed = progressSchema.safeParse(body);
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

  const { lessonId, miniChallengePassed, timeSpentMs } = parsed.data;

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
  });

  const bestTimeMs =
    miniChallengePassed && timeSpentMs !== undefined
      ? existing?.bestTimeMs !== null && existing?.bestTimeMs !== undefined
        ? Math.min(existing.bestTimeMs, timeSpentMs)
        : timeSpentMs
      : existing?.bestTimeMs ?? null;

  const record = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: {
      userId: user.id,
      lessonId,
      miniChallengePassed,
      completed: miniChallengePassed,
      bestTimeMs: miniChallengePassed ? (timeSpentMs ?? null) : null,
      attempts: 1,
      lastAttemptAt: new Date(),
    },
    update: {
      miniChallengePassed: miniChallengePassed || existing?.miniChallengePassed || false,
      completed: miniChallengePassed || existing?.completed || false,
      bestTimeMs,
      attempts: { increment: 1 },
      lastAttemptAt: new Date(),
    },
  });

  const newBadges =
    miniChallengePassed && !existing?.completed
      ? await checkAndAwardBadges(user.id)
      : [];

  return NextResponse.json({
    success: true,
    progress: {
      lessonId: record.lessonId,
      completed: record.completed,
      miniChallengePassed: record.miniChallengePassed,
      bestTimeMs: record.bestTimeMs,
      attempts: record.attempts,
      lastAttemptAt: record.lastAttemptAt?.toISOString() ?? null,
    },
    newBadges,
  });
}
