import { auth } from '@clerk/nextjs/server';
import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { LearnStepStoredState } from '@/lib/learn/step-storage';

const putBodySchema = z.object({
  moduleId: z.string(),
  stepId: z.string(),
  state: z.record(z.unknown()),
});

async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

function mergeStepState(
  existing: LearnStepStoredState | null,
  patch: LearnStepStoredState
): LearnStepStoredState {
  return { ...(existing ?? {}), ...patch };
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
    return NextResponse.json({ error: 'moduleId required' }, { status: 400 });
  }

  const records = await prisma.learnStepState.findMany({
    where: { userId: user.id, moduleId },
    select: { stepId: true, state: true },
  });

  const states: Record<string, LearnStepStoredState> = {};
  for (const record of records) {
    states[record.stepId] = record.state as LearnStepStoredState;
  }

  return NextResponse.json({ states });
}

export async function PUT(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const parsed = putBodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { moduleId, stepId, state } = parsed.data;
  const patch = state as LearnStepStoredState;

  const existing = await prisma.learnStepState.findUnique({
    where: {
      userId_moduleId_stepId: { userId: user.id, moduleId, stepId },
    },
    select: { state: true },
  });

  const merged = mergeStepState(
    (existing?.state as LearnStepStoredState | undefined) ?? null,
    patch
  );
  const stateJson = merged as Prisma.InputJsonValue;

  const record = await prisma.learnStepState.upsert({
    where: {
      userId_moduleId_stepId: { userId: user.id, moduleId, stepId },
    },
    create: {
      userId: user.id,
      moduleId,
      stepId,
      state: stateJson,
    },
    update: { state: stateJson },
  });

  return NextResponse.json({ state: record.state });
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
  const moduleId = searchParams.get('moduleId');
  const stepId = searchParams.get('stepId');

  if (!moduleId) {
    return NextResponse.json({ error: 'moduleId required' }, { status: 400 });
  }

  if (stepId) {
    await prisma.learnStepState.deleteMany({
      where: { userId: user.id, moduleId, stepId },
    });
  } else {
    await prisma.learnStepState.deleteMany({
      where: { userId: user.id, moduleId },
    });
  }

  return NextResponse.json({ ok: true });
}
