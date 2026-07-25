import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getCategoryLabel,
  getChallengeHref,
  getChallengeTitle,
} from '@/lib/challenge-lookup';
import { getNotesForChallenges } from '@/lib/notes';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const now = new Date();
    const dueItems = await prisma.spacedRepetitionItem.findMany({
      where: {
        userId: user.id,
        nextReviewAt: { lte: now },
      },
      orderBy: { nextReviewAt: 'asc' },
    });

    const noteMap = await getNotesForChallenges(
      user.id,
      dueItems.map((item) => item.challengeId)
    );

    const items = dueItems.map((item) => {
      const overdueMs = now.getTime() - item.nextReviewAt.getTime();
      const overdueDays = Math.max(0, Math.floor(overdueMs / 86400000));

      return {
        challengeId: item.challengeId,
        challengeTitle: getChallengeTitle(item.challengeId),
        category: getCategoryLabel(item.challengeType),
        challengeType: item.challengeType,
        difficulty: item.difficulty,
        dueDate: item.nextReviewAt.toISOString(),
        overdueDays,
        href: getChallengeHref(item.challengeId, item.challengeType),
        hasNote: noteMap.has(item.challengeId),
      };
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
