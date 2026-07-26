import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSystemDesignChallengeById } from '@/data/system-design';
import type { SystemDesignSectionGrade } from '@/data/types';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const audioMetaSchema = z
  .object({
    fillerWordCount: z.number().optional(),
    wordsPerMinute: z.number().optional(),
    confidenceScore: z.number().optional(),
  })
  .optional();

const sectionAnswerSchema = z.object({
  sectionId: z.string(),
  textContent: z.string().min(1),
  audioDataUrl: z.string().optional(),
  transcript: z.string().optional(),
  analytics: audioMetaSchema,
});

const submitSchema = z.object({
  answers: z.array(sectionAnswerSchema).min(1),
  sectionGrades: z.array(
    z.object({
      sectionId: z.string(),
      score: z.number(),
      feedback: z.string(),
      strengths: z.array(z.string()),
      gaps: z.array(z.string()),
    })
  ),
});

const dialogSchema = z.object({
  dialogHistory: z.array(
    z.object({
      role: z.enum(['assistant', 'user']),
      content: z.string(),
      audioClipUrl: z.string().optional(),
      transcript: z.string().optional(),
      fillerWordCount: z.number().optional(),
      wordsPerMinute: z.number().optional(),
      confidenceScore: z.number().optional(),
    })
  ),
  followUpAnswer: sectionAnswerSchema.optional(),
  aiFeedback: z.string().optional(),
  completed: z.boolean().optional(),
});

async function getOwnedSession(sessionId: string, userId: string) {
  return prisma.systemDesignSession.findFirst({
    where: { id: sessionId, userId },
    include: { answers: true },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { sessionId } = await params;
  const session = await getOwnedSession(sessionId, authResult.user.id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({
    session: {
      id: session.id,
      challengeId: session.challengeId,
      challengeTitle: session.challengeTitle,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
      overallScore: session.overallScore,
      sectionScores: session.sectionScores,
      aiFeedback: session.aiFeedback,
      dialogHistory: session.dialogHistory,
      answers: session.answers.map((a) => ({
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
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { sessionId } = await params;
  const session = await getOwnedSession(sessionId, authResult.user.id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = (body as { action?: string }).action;

  if (action === 'submit') {
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const sectionScores: Record<string, number> = {};
    for (const grade of parsed.data.sectionGrades) {
      sectionScores[grade.sectionId] = grade.score;
    }

    const overallScore =
      Object.values(sectionScores).reduce((sum, s) => sum + s, 0) /
      Object.values(sectionScores).length;

    await prisma.systemDesignAnswer.deleteMany({ where: { sessionId } });

    await prisma.systemDesignAnswer.createMany({
      data: parsed.data.answers.map((a) => ({
        sessionId,
        section: a.sectionId,
        questionText: '',
        textContent: a.textContent,
        transcript: a.transcript ?? a.textContent,
        audioUrl: a.audioDataUrl ?? null,
        fillerWordCount: a.analytics?.fillerWordCount ?? null,
        wordsPerMinute: a.analytics?.wordsPerMinute ?? null,
        confidenceScore: a.analytics?.confidenceScore ?? null,
      })),
    });

    const updated = await prisma.systemDesignSession.update({
      where: { id: sessionId },
      data: {
        overallScore,
        sectionScores,
        aiFeedback: parsed.data.sectionGrades
          .map((g) => `**${g.sectionId}** (${g.score}/100): ${g.feedback}`)
          .join('\n\n'),
      },
    });

    return NextResponse.json({
      sessionId: updated.id,
      overallScore: updated.overallScore,
      sectionScores: updated.sectionScores,
      sectionGrades: parsed.data.sectionGrades,
    });
  }

  if (action === 'dialog') {
    const parsed = dialogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.followUpAnswer) {
      const a = parsed.data.followUpAnswer;
      await prisma.systemDesignAnswer.create({
        data: {
          sessionId,
          section: 'followup',
          questionText:
            (parsed.data.dialogHistory.filter((m) => m.role === 'assistant').at(-1)?.content) ??
            'Follow-up',
          textContent: a.textContent,
          transcript: a.transcript ?? a.textContent,
          audioUrl: a.audioDataUrl ?? null,
          fillerWordCount: a.analytics?.fillerWordCount ?? null,
          wordsPerMinute: a.analytics?.wordsPerMinute ?? null,
          confidenceScore: a.analytics?.confidenceScore ?? null,
        },
      });
    }

    const updated = await prisma.systemDesignSession.update({
      where: { id: sessionId },
      data: {
        dialogHistory: parsed.data.dialogHistory,
        aiFeedback: parsed.data.aiFeedback ?? session.aiFeedback,
        completedAt: parsed.data.completed ? new Date() : session.completedAt,
      },
    });

    return NextResponse.json({ sessionId: updated.id, completed: Boolean(updated.completedAt) });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
