import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getLearnModule } from '@/data/learn/modules';
import { resetAllLearnProgress, resetLearnModuleProgress } from '@/lib/learn/reset-progress';
import { computeModuleStatus } from '@/lib/learn/unlock';
import type { LearnStep } from '@/data/learn/types';

const bodySchema = z.object({
  moduleId: z.string(),
  stepIndex: z.number().int().min(0),
  completed: z.boolean().optional(),
  timeSpentMs: z.number().int().min(0).optional(),
});

async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

function stepToReviewData(step: LearnStep) {
  if (step.type === 'predict-output') {
    return {
      reviewType: 'predict_output' as const,
      data: {
        prompt: step.prompt,
        code: step.code,
        expectedOutput: step.expectedOutput,
        hint: step.hint,
      },
    };
  }
  if (step.type === 'code-challenge') {
    return {
      reviewType: 'code_goal' as const,
      data: {
        prompt: step.prompt,
        setupCode: step.setupCode,
        starterCode: step.starterCode,
        solutionCode: step.solutionCode,
        expectedOutput: step.expectedOutput,
        goalType: step.goalType,
        outputFlex: step.outputFlex,
        hint: step.hint,
      },
    };
  }
  return null;
}

async function seedReviewItems(
  userId: string,
  moduleId: string,
  steps: LearnStep[]
) {
  const reviewable = steps
    .map((step) => ({ step, review: stepToReviewData(step) }))
    .filter((x): x is { step: LearnStep; review: NonNullable<ReturnType<typeof stepToReviewData>> } =>
      x.review !== null
    );

  for (const { step, review } of reviewable) {
    for (const conceptTag of step.conceptTags) {
      await prisma.learnConceptReview.upsert({
        where: { userId_stepId: { userId, stepId: step.id } },
        create: {
          userId,
          conceptTag,
          moduleId,
          stepId: step.id,
          reviewType: review.reviewType,
          reviewData: review.data,
          nextReviewAt: new Date(),
        },
        update: {},
      });
    }
  }
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { moduleId, stepIndex, completed, timeSpentMs } = parsed.data;
  const mod = getLearnModule(moduleId);
  if (!mod || !mod.contentAvailable) {
    return NextResponse.json({ error: 'Module not available' }, { status: 404 });
  }

  const progressRecords = await prisma.learnModuleProgress.findMany({
    where: { userId: user.id },
  });
  const progressMap = new Map(progressRecords.map((p) => [p.moduleId, p]));
  const status = computeModuleStatus(moduleId, progressMap);

  if (status === 'locked') {
    return NextResponse.json({ error: 'Module locked' }, { status: 403 });
  }

  const isComplete = completed ?? stepIndex >= mod.steps.length - 1;
  const nextStatus = isComplete ? 'completed' : 'in_progress';

  const record = await prisma.learnModuleProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId } },
    create: {
      userId: user.id,
      moduleId,
      status: nextStatus,
      currentStepIndex: stepIndex,
      completedAt: isComplete ? new Date() : null,
      timeSpentMs: timeSpentMs ?? 0,
    },
    update: {
      status: nextStatus,
      currentStepIndex: stepIndex,
      completedAt: isComplete ? new Date() : null,
      timeSpentMs: timeSpentMs
        ? { increment: timeSpentMs }
        : undefined,
    },
  });

  if (isComplete) {
    await seedReviewItems(user.id, moduleId, mod.steps);
  }

  return NextResponse.json({ progress: record });
}

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const moduleId = new URL(req.url).searchParams.get('moduleId');
  if (!moduleId) {
    const records = await prisma.learnModuleProgress.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json({ progress: records });
  }

  const record = await prisma.learnModuleProgress.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId } },
  });

  return NextResponse.json({ progress: record });
}

export async function DELETE(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope');
  const moduleId = searchParams.get('moduleId');

  if (scope === 'all') {
    await resetAllLearnProgress(user.id);
    return NextResponse.json({ ok: true, scope: 'all' });
  }

  if (!moduleId) {
    return NextResponse.json(
      { error: 'Provide moduleId or scope=all' },
      { status: 400 }
    );
  }

  const mod = getLearnModule(moduleId);
  if (!mod) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  }

  await resetLearnModuleProgress(user.id, moduleId);
  return NextResponse.json({ ok: true, moduleId });
}
