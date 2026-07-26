import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVoiceQuestionById } from '@/data/voice-interviews';
import { requireAuthUser } from '@/lib/ai-auth';
import { parseAudioBase64Payload } from '@/lib/parse-audio-data-url';
import { parseQuestionIds, resolveSessionQuestions } from '@/lib/playbook/voice-questions';
import { uploadAudioClip } from '@/lib/r2';
import { prisma } from '@/lib/prisma';

const answerSchema = z.object({
  questionText: z.string().min(1),
  questionType: z.enum(['opening', 'followup', 'challenge', 'wrap']),
  questionId: z.string().optional(),
  transcript: z.string().min(1),
  audioBase64: z.string().optional(),
  audioContentType: z.string().optional(),
  fillerWordCount: z.number().optional(),
  wordsPerMinute: z.number().optional(),
  confidenceScore: z.number().optional(),
  durationSeconds: z.number().optional(),
  aiContentScore: z.number().optional(),
  aiContentFeedback: z.string().optional(),
  aiGaps: z.array(z.string()).optional(),
});

const completeSchema = z.object({
  action: z.literal('complete'),
  aiFeedback: z.string().min(1),
  overallScore: z.number(),
  contentScore: z.number(),
  communicationScore: z.number(),
});

async function getOwnedSession(sessionId: string, userId: string) {
  return prisma.voiceInterviewSession.findFirst({
    where: { id: sessionId, userId },
    include: { exchanges: { orderBy: { order: 'asc' } } },
  });
}

function serializeSession(
  session: NonNullable<Awaited<ReturnType<typeof getOwnedSession>>>
) {
  return {
    id: session.id,
    category: session.category,
    difficulty: session.difficulty,
    questionIds: parseQuestionIds(session.questionIds),
    sessionQuestionCount: session.sessionQuestionCount,
    includeFollowUps: session.includeFollowUps,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString() ?? null,
    overallScore: session.overallScore,
    contentScore: session.contentScore,
    communicationScore: session.communicationScore,
    aiFeedback: session.aiFeedback,
    exchanges: session.exchanges.map((e) => ({
      id: e.id,
      questionId: e.questionId,
      order: e.order,
      questionText: e.questionText,
      questionType: e.questionType,
      answerTranscript: e.answerTranscript,
      answerAudioUrl: e.answerAudioUrl,
      answerDurationSec: e.answerDurationSec,
      fillerWordCount: e.fillerWordCount,
      wordsPerMinute: e.wordsPerMinute,
      deepgramConfidence: e.deepgramConfidence,
      aiContentScore: e.aiContentScore,
      aiContentFeedback: e.aiContentFeedback,
      aiGaps: e.aiGaps,
      createdAt: e.createdAt.toISOString(),
    })),
  };
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

  const questionIds = parseQuestionIds(session.questionIds);
  const questions = await resolveSessionQuestions(session.questionIds, session.customQuestionTexts);

  return NextResponse.json({
    session: serializeSession(session),
    questions,
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

  if (action === 'complete') {
    const parsed = completeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.voiceInterviewSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        aiFeedback: parsed.data.aiFeedback,
        overallScore: parsed.data.overallScore,
        contentScore: parsed.data.contentScore,
        communicationScore: parsed.data.communicationScore,
      },
      include: { exchanges: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ session: serializeSession(updated) });
  }

  if (action === 'add-exchange') {
    const parsed = answerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const nextOrder = session.exchanges.length + 1;
    let audioUrl: string | null = null;

    if (parsed.data.audioBase64) {
      let contentType = parsed.data.audioContentType ?? 'audio/webm';
      let buffer: Buffer;

      try {
        const payload = parseAudioBase64Payload(parsed.data.audioBase64, contentType);
        contentType = payload.contentType;
        buffer = payload.buffer;
      } catch {
        return NextResponse.json({ error: 'Invalid audio data' }, { status: 400 });
      }

      if (buffer.length === 0) {
        return NextResponse.json({ error: 'Audio recording is empty' }, { status: 400 });
      }

      audioUrl = await uploadAudioClip(
        buffer,
        authResult.user.id,
        sessionId,
        nextOrder,
        contentType
      );
    }

    const exchange = await prisma.voiceExchange.create({
      data: {
        sessionId,
        order: nextOrder,
        questionId: parsed.data.questionId ?? null,
        questionText: parsed.data.questionText,
        questionType: parsed.data.questionType,
        answerTranscript: parsed.data.transcript,
        answerAudioUrl: audioUrl,
        answerDurationSec: parsed.data.durationSeconds ?? null,
        fillerWordCount: parsed.data.fillerWordCount ?? null,
        wordsPerMinute: parsed.data.wordsPerMinute ?? null,
        deepgramConfidence: parsed.data.confidenceScore ?? null,
        aiContentScore: parsed.data.aiContentScore ?? null,
        aiContentFeedback: parsed.data.aiContentFeedback ?? null,
        aiGaps: parsed.data.aiGaps ?? undefined,
      },
    });

    return NextResponse.json({
      exchange: {
        id: exchange.id,
        order: exchange.order,
        questionText: exchange.questionText,
        questionType: exchange.questionType,
        answerTranscript: exchange.answerTranscript,
        answerAudioUrl: exchange.answerAudioUrl,
        answerDurationSec: exchange.answerDurationSec,
        fillerWordCount: exchange.fillerWordCount,
        wordsPerMinute: exchange.wordsPerMinute,
        deepgramConfidence: exchange.deepgramConfidence,
        aiContentScore: exchange.aiContentScore,
        aiContentFeedback: exchange.aiContentFeedback,
        aiGaps: exchange.aiGaps,
      },
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
