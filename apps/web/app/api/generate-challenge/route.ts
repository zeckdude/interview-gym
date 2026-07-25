import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { runGenerationJob } from '@/lib/generate-challenge-job';
import { prisma } from '@/lib/prisma';

export const maxDuration = 300;

const requestSchema = z.object({
  userDescription: z.string().min(10).max(5000),
  companyName: z.string().max(200).optional(),
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

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { userDescription, companyName } = parsed.data;
  const { user } = authResult;

  const job = await prisma.challengeGenerationJob.create({
    data: {
      userId: user.id,
      sourceDescription: userDescription,
      companyName: companyName ?? null,
      status: 'pending',
      statusMessage: 'Queued for generation…',
    },
  });

  void runGenerationJob(job.id).catch((err) => {
    console.error('[generate-challenge] Background job failed:', err);
  });

  return NextResponse.json(
    {
      jobId: job.id,
      status: job.status,
      message:
        'Generation started. You can navigate away — we will notify you when your challenge is ready.',
    },
    { status: 202 }
  );
}
