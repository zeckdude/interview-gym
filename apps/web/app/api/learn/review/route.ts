import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { updateSrsAfterReview, qualityFromCorrect } from '@/lib/learn/srs';
import type { ConceptWeight } from '@/data/learn/types';

async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
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

  const url = new URL(req.url);
  const manual = url.searchParams.get('manual') === 'true';
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '10', 10), 50);
  const now = new Date();

  const weights = await prisma.learnConceptWeight.findMany({
    where: { userId: user.id },
  });
  const weightMap = new Map(weights.map((w) => [w.conceptTag, w.weight as ConceptWeight]));

  let items = await prisma.learnConceptReview.findMany({
    where: manual
      ? { userId: user.id }
      : { userId: user.id, nextReviewAt: { lte: now } },
    orderBy: { nextReviewAt: 'asc' },
    take: manual ? limit * 3 : limit * 2,
  });

  if (manual) {
    items = items
      .map((item) => {
        const w = weightMap.get(item.conceptTag) ?? 0;
        const boost = w === 1 ? 3 : w === -1 ? 0.3 : 1;
        const overdueDays = Math.max(
          0,
          (now.getTime() - item.nextReviewAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { item, score: boost * (1 + overdueDays) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.item);
  } else {
    items = items.slice(0, limit);
  }

  const conceptTags = Array.from(new Set(items.map((i) => i.conceptTag)));

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      conceptTag: item.conceptTag,
      moduleId: item.moduleId,
      stepId: item.stepId,
      reviewType: item.reviewType,
      reviewData: item.reviewData,
      nextReviewAt: item.nextReviewAt.toISOString(),
      weight: weightMap.get(item.conceptTag) ?? 0,
    })),
    conceptTags,
  });
}

const submitSchema = z.object({
  reviewId: z.string(),
  correct: z.boolean(),
  hintUsed: z.boolean().optional(),
});

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const parsed = submitSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const item = await prisma.learnConceptReview.findFirst({
    where: { id: parsed.data.reviewId, userId: user.id },
  });
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const weightRow = await prisma.learnConceptWeight.findUnique({
    where: { userId_conceptTag: { userId: user.id, conceptTag: item.conceptTag } },
  });
  const weight = (weightRow?.weight ?? 0) as ConceptWeight;

  const quality = qualityFromCorrect(parsed.data.correct, parsed.data.hintUsed ?? false);
  const updated = updateSrsAfterReview({
    repetitions: item.repetitions,
    easeFactor: item.easeFactor,
    intervalDays: item.intervalDays,
    quality,
    weight,
  });

  const record = await prisma.learnConceptReview.update({
    where: { id: item.id },
    data: {
      repetitions: updated.repetitions,
      easeFactor: updated.easeFactor,
      intervalDays: updated.intervalDays,
      nextReviewAt: updated.nextReviewAt,
      lastReviewedAt: new Date(),
      timesCorrect: parsed.data.correct ? { increment: 1 } : undefined,
      timesIncorrect: !parsed.data.correct ? { increment: 1 } : undefined,
    },
  });

  return NextResponse.json({ review: record });
}
