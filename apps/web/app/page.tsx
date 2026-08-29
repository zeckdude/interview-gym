import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PathMapClient } from '@/components/learn/PathMapClient';
import { PageWrapper } from '@/components/layout/PageWrapper';
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

export default async function HomePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect('/sign-in');
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

  return (
    <PageWrapper title="Learn" fullWidth>
      <PathMapClient
        initialData={{
          trackId: LEARN_TRACK_ID,
          title: 'Modern JavaScript',
          levelLabels: LEVEL_LABELS,
          nodes: LEARN_GRAPH_NODES,
          moduleProgress,
          stats: {
            completed,
            available,
            total: LEARN_GRAPH_NODES.length,
            reviewDueCount,
          },
        }}
      />
    </PageWrapper>
  );
}
