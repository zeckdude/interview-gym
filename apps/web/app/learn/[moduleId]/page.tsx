import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { ModuleRunner } from '@/components/learn/ModuleRunner';
import { getLearnModule } from '@/data/learn/modules';
import { prisma } from '@/lib/prisma';
import { computeModuleStatus } from '@/lib/learn/unlock';
import { buildModuleProgressViews } from '@/lib/learn/unlock';

function buildCoveredModuleIds(
  progressRecords: { moduleId: string; status: string; currentStepIndex: number }[],
  currentModuleId: string
): string[] {
  const ids = new Set<string>();
  for (const record of progressRecords) {
    if (record.status === 'completed') {
      ids.add(record.moduleId);
    }
    if (
      record.moduleId === currentModuleId &&
      (record.status === 'completed' || record.currentStepIndex > 0)
    ) {
      ids.add(record.moduleId);
    }
  }
  return Array.from(ids);
}

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function LearnModulePage({ params }: PageProps) {
  const { moduleId } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect('/sign-in');

  const mod = getLearnModule(moduleId);
  if (!mod || !mod.contentAvailable || mod.steps.length === 0) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) redirect('/sign-in');

  const progressRecords = await prisma.learnModuleProgress.findMany({
    where: { userId: user.id },
  });
  const progressMap = new Map(progressRecords.map((p) => [p.moduleId, p]));
  const status = computeModuleStatus(moduleId, progressMap);

  if (status === 'locked') {
    redirect('/');
  }

  const views = buildModuleProgressViews(progressRecords);
  const moduleProgress = views.find((p) => p.moduleId === moduleId) ?? null;
  const coveredModuleIds = buildCoveredModuleIds(progressRecords, moduleId);

  return (
    <ModuleRunner
      module={mod}
      initialProgress={moduleProgress}
      coveredModuleIds={coveredModuleIds}
    />
  );
}
