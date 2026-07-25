import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const challenges = await prisma.userChallenge.findMany({
    where: { userId: authResult.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      attempts: {
        where: { userId: authResult.user.id },
        select: { passed: true },
      },
    },
  });

  const items = challenges.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    difficulty: c.difficulty,
    concepts: c.concepts,
    companyName: c.companyName,
    createdAt: c.createdAt.toISOString(),
    attemptCount: c.attempts.length,
    hasPassed: c.attempts.some((a) => a.passed),
  }));

  return NextResponse.json({ challenges: items });
}
