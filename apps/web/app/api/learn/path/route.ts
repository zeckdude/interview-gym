import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  LEARN_GRAPH_NODES,
  LEVEL_LABELS,
  LEARN_TRACK_ID,
} from '@/data/learn/graph';
import {
  buildModuleProgressViews,
  countCompletedModules,
  countContentAvailableModules,
} from '@/lib/learn/unlock';

async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const [progressRecords, reviewDueCount] = await Promise.all([
    prisma.learnModuleProgress.findMany({ where: { userId: user.id } }),
    prisma.learnConceptReview.count({
      where: { userId: user.id, nextReviewAt: { lte: new Date() } },
    }),
  ]);

  const moduleProgress = buildModuleProgressViews(progressRecords);
  const completed = countCompletedModules(progressRecords);
  const available = countContentAvailableModules();

  return NextResponse.json({
    trackId: LEARN_TRACK_ID,
    title: 'Modern JavaScript',
    subtitle: 'JavaScript from the ground up — EP parity + mastery reviews',
    levelLabels: LEVEL_LABELS,
    nodes: LEARN_GRAPH_NODES,
    moduleProgress,
    stats: {
      completed,
      available,
      total: LEARN_GRAPH_NODES.length,
      reviewDueCount,
    },
  });
}
