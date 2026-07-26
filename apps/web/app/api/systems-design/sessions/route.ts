import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSystemDesignChallengeById } from '@/data/system-design';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  challengeId: z.string().min(1),
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const challenge = getSystemDesignChallengeById(parsed.data.challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  const session = await prisma.systemDesignSession.create({
    data: {
      userId: authResult.user.id,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
    },
  });

  return NextResponse.json({ sessionId: session.id });
}

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const sessions = await prisma.systemDesignSession.findMany({
    where: { userId: authResult.user.id },
    orderBy: { startedAt: 'desc' },
    include: {
      answers: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      challengeId: s.challengeId,
      challengeTitle: s.challengeTitle,
      startedAt: s.startedAt.toISOString(),
      completedAt: s.completedAt?.toISOString() ?? null,
      overallScore: s.overallScore,
      sectionScores: s.sectionScores,
      aiFeedback: s.aiFeedback,
      dialogHistory: s.dialogHistory,
      answers: s.answers.map((a) => ({
        id: a.id,
        section: a.section,
        questionText: a.questionText,
        textContent: a.textContent,
        audioUrl: a.audioUrl,
        transcript: a.transcript,
        fillerWordCount: a.fillerWordCount,
        wordsPerMinute: a.wordsPerMinute,
        confidenceScore: a.confidenceScore,
        createdAt: a.createdAt.toISOString(),
      })),
    })),
  });
}
