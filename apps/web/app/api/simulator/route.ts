import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';
import { selectSimulatorChallenges } from '@/lib/simulator';

const createSessionSchema = z.object({
  difficulty: z.enum(['easy', 'intermediate', 'advanced', 'mixed']),
  category: z.enum(['be', 'frontend', 'react', 'nextjs', 'mixed']),
  durationMinutes: z.union([z.literal(45), z.literal(60)]),
  challengeCount: z.union([z.literal(3), z.literal(4), z.literal(5)]),
});

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { difficulty, category, durationMinutes, challengeCount } = parsed.data;

  const recentSessions = await prisma.simulatorSession.findMany({
    where: { userId: authResult.user.id },
    orderBy: { startedAt: 'desc' },
    take: 3,
    include: { challenges: { select: { challengeId: true } } },
  });

  const recentChallengeIds = recentSessions.flatMap((s) =>
    s.challenges.map((c) => c.challengeId)
  );

  const selected = selectSimulatorChallenges(
    { difficulty, category, count: challengeCount },
    recentChallengeIds
  );

  if (selected.length < challengeCount) {
    return NextResponse.json(
      { error: 'Not enough challenges available for this configuration' },
      { status: 400 }
    );
  }

  const session = await prisma.simulatorSession.create({
    data: {
      userId: authResult.user.id,
      difficulty,
      category,
      durationMinutes,
      challengeCount,
      startedAt: new Date(),
      challenges: {
        create: selected.map((c, i) => ({
          challengeId: c.id,
          order: i + 1,
        })),
      },
    },
    include: {
      challenges: { orderBy: { order: 'asc' } },
    },
  });

  return NextResponse.json({
    sessionId: session.id,
    challengeIds: session.challenges.map((c) => c.challengeId),
  });
}
