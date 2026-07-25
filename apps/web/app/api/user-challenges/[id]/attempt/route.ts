import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  passed: z.boolean(),
  code: z.string().optional(),
  language: z.enum(['javascript', 'typescript']),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;

  const challenge = await prisma.userChallenge.findFirst({
    where: { id, userId: authResult.user.id },
  });

  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const attempt = await prisma.userChallengeAttempt.create({
    data: {
      userId: authResult.user.id,
      challengeId: id,
      passed: parsed.data.passed,
      code: parsed.data.code ?? null,
      language: parsed.data.language,
    },
  });

  return NextResponse.json({ success: true, attemptId: attempt.id });
}
