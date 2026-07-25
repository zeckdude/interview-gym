import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { jobId } = await params;

  const job = await prisma.challengeGenerationJob.findFirst({
    where: { id: jobId, userId: authResult.user.id },
  });

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  let challenge = null;
  if (job.challengeId) {
    challenge = await prisma.userChallenge.findUnique({
      where: { id: job.challengeId },
    });
  }

  return NextResponse.json({
    job: {
      id: job.id,
      status: job.status,
      statusMessage: job.statusMessage,
      errorMessage: job.errorMessage,
      challengeId: job.challengeId,
      createdAt: job.createdAt.toISOString(),
      completedAt: job.completedAt?.toISOString() ?? null,
    },
    challenge,
  });
}
