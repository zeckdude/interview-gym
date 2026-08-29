import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  moduleId: z.string().min(1),
  stepId: z.string().min(1),
  stepType: z.enum(['predict-output', 'code-challenge']),
  eventType: z.enum(['wrong_attempt', 'hint_shown', 'reveal', 'success']),
  mistakeKind: z.string().optional(),
  answerFingerprint: z.string().max(120).optional(),
  hintsShown: z.number().int().min(0).max(3).optional(),
  revealed: z.boolean().optional(),
  eventuallyCorrect: z.boolean().optional(),
});

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const data = parsed.data;

  await prisma.learnHintEvent.create({
    data: {
      userId: user.id,
      moduleId: data.moduleId,
      stepId: data.stepId,
      stepType: data.stepType,
      eventType: data.eventType,
      mistakeKind: data.mistakeKind ?? null,
      answerFingerprint: data.answerFingerprint ?? null,
      hintsShown: data.hintsShown ?? 0,
      revealed: data.revealed ?? false,
      eventuallyCorrect: data.eventuallyCorrect ?? false,
    },
  });

  return NextResponse.json({ ok: true });
}
