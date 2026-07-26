import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pickVoiceQuestions } from '@/data/voice-interviews';
import { requireAuthUser } from '@/lib/ai-auth';
import { isPlaybookCategoryId } from '@/lib/playbook/categories';
import { pickPlaybookQuestions } from '@/lib/playbook/db';
import { parseQuestionIds } from '@/lib/playbook/voice-questions';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  category: z.enum([
    'behavioral',
    'technical',
    'frontend',
    'nextjs',
    'systems',
    'culture',
    'mixed',
    'playbook',
  ]),
  difficulty: z.enum(['easy', 'intermediate', 'advanced', 'mixed']),
  sessionQuestionCount: z.number().int().min(1).max(10),
  includeFollowUps: z.boolean().default(true),
  mostAskedOnly: z.boolean().optional(),
  questionId: z.string().optional(),
  playbookCategories: z.array(z.string()).optional(),
  presetId: z.string().optional().nullable(),
  interviewType: z.enum(['voice', 'text', 'mixed']).optional(),
  companyContextId: z.string().optional().nullable(),
  customQuestionTexts: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  if (
    data.category === 'playbook' &&
    !data.questionId &&
    (!data.customQuestionTexts || data.customQuestionTexts.length === 0) &&
    (!data.playbookCategories || data.playbookCategories.length === 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide playbook questions or select categories',
      path: ['customQuestionTexts'],
    });
  }
});

function serializeSession(
  session: Awaited<ReturnType<typeof prisma.voiceInterviewSession.findFirst>> & {
    exchanges: Awaited<ReturnType<typeof prisma.voiceExchange.findMany>>;
  }
) {
  return {
    id: session!.id,
    category: session!.category,
    difficulty: session!.difficulty,
    questionIds: parseQuestionIds(session!.questionIds),
    sessionQuestionCount: session!.sessionQuestionCount,
    includeFollowUps: session!.includeFollowUps,
    mostAskedOnly: session!.mostAskedOnly,
    presetId: session!.presetId,
    playbookCategories: session!.playbookCategories,
    interviewType: session!.interviewType,
    companyContextId: session!.companyContextId,
    customQuestionTexts: session!.customQuestionTexts,
    startedAt: session!.startedAt.toISOString(),
    completedAt: session!.completedAt?.toISOString() ?? null,
    overallScore: session!.overallScore,
    contentScore: session!.contentScore,
    communicationScore: session!.communicationScore,
    aiFeedback: session!.aiFeedback,
    exchanges: session!.exchanges
      .sort((a, b) => a.order - b.order)
      .map((e) => ({
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

  const {
    category,
    difficulty,
    sessionQuestionCount,
    includeFollowUps,
    mostAskedOnly,
    questionId,
    playbookCategories,
    presetId,
    interviewType,
    companyContextId,
    customQuestionTexts,
  } = parsed.data;

  let questionIds: string[];

  if (questionId) {
    questionIds = [questionId];
  } else if (customQuestionTexts?.length) {
    questionIds = customQuestionTexts.map((_, i) => `playbook-custom-${i}`);
  } else if (category === 'playbook' && playbookCategories?.length) {
    const validCategories = playbookCategories.filter(isPlaybookCategoryId);
    const questions = await pickPlaybookQuestions(authResult.user.id, {
      categories: validCategories.length ? validCategories : ['story'],
      difficulty: difficulty === 'mixed' ? 'mixed' : difficulty,
      count: sessionQuestionCount,
      mostAskedOnly,
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No playbook questions match your filters.' },
        { status: 400 }
      );
    }

    questionIds = questions.map((q) => q.id);
  } else {
    const questions = pickVoiceQuestions({
      category: category === 'playbook' ? 'mixed' : category,
      difficulty,
      count: sessionQuestionCount as 1 | 3 | 5,
      mostAskedOnly,
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions match your filters. Try different category or difficulty.' },
        { status: 400 }
      );
    }

    questionIds = questions.map((q) => q.id);
  }

  if (companyContextId) {
    const context = await prisma.simulatorCompanyContext.findFirst({
      where: { id: companyContextId, userId: authResult.user.id },
    });
    if (!context) {
      return NextResponse.json({ error: 'Invalid company context' }, { status: 400 });
    }
  }

  const session = await prisma.voiceInterviewSession.create({
    data: {
      userId: authResult.user.id,
      category: category === 'playbook' ? 'playbook' : category === 'mixed' ? 'mixed' : category,
      difficulty: difficulty === 'mixed' ? 'mixed' : difficulty,
      questionIds,
      sessionQuestionCount: questionIds.length,
      includeFollowUps,
      mostAskedOnly: mostAskedOnly ?? false,
      presetId: presetId ?? null,
      playbookCategories: playbookCategories ?? undefined,
      interviewType: interviewType ?? 'voice',
      companyContextId: companyContextId ?? null,
      customQuestionTexts: customQuestionTexts ?? undefined,
    },
    include: { exchanges: true },
  });

  return NextResponse.json({ sessionId: session.id });
}

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const sessions = await prisma.voiceInterviewSession.findMany({
    where: { userId: authResult.user.id },
    orderBy: { startedAt: 'desc' },
    include: {
      exchanges: { orderBy: { order: 'asc' } },
    },
  });

  return NextResponse.json({
    sessions: sessions.map((s) => serializeSession(s)),
  });
}
