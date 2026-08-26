import { getPathItemHref, getPathItemTitle } from '@/lib/paths/item-resolver';
import {
  getAllStageItemsForPathType,
  getPathProgress,
  seedCuratedPathStageItems,
} from '@/lib/paths/db';
import {
  getCurrentStage,
  getStageStatus,
  getStageSummary,
} from '@/lib/paths/gating';
import { getDailyQueue } from '@/lib/paths/progress';
import { STAGE_DEFINITIONS } from '@/lib/paths/stage-definitions';
import type { PathItemType, ResolvedPathItem } from '@/lib/paths/types';
import { prisma } from '@/lib/prisma';

export async function buildPathView(userId: string, pathId: string) {
  await seedCuratedPathStageItems();

  const path = await prisma.learningPath.findFirst({
    where: { id: pathId, userId },
  });

  if (!path) return null;

  const pathType = path.type as 'fe' | 'be' | 'fullstack';
  const stageItems = await getAllStageItemsForPathType(pathType);
  const progress = await getPathProgress(userId, pathId);
  const progressMap = new Map(progress.map((p) => [p.itemId, p]));

  const currentStage = await getCurrentStage(userId, pathId);
  const dailyQueue = await getDailyQueue(userId, pathId);

  const stages = await Promise.all(
    ([1, 2, 3] as const).map(async (stage) => {
      const summary = await getStageSummary(userId, pathId, stage);
      const status = await getStageStatus(userId, pathId, stage);
      const def = STAGE_DEFINITIONS[stage];

      const items: ResolvedPathItem[] = stageItems
        .filter((item) => item.stage === stage)
        .map((item) => {
          const p = progressMap.get(item.itemId);
          const itemType = item.itemType as PathItemType;
          const attempts = p?.attempts ?? 0;
          const status = (p?.status ?? 'locked') as ResolvedPathItem['status'];
          const markEligible =
            attempts >= 3 &&
            status !== 'passed' &&
            status !== 'understood' &&
            status !== 'locked';

          return {
            stage: item.stage as 1 | 2 | 3,
            itemType,
            itemId: item.itemId,
            order: item.order,
            mostAsked: item.mostAsked,
            status,
            attempts,
            markedUnderstood: p?.markedUnderstood ?? false,
            title: getPathItemTitle(item.itemId, itemType),
            href: getPathItemHref(item.itemId, itemType),
            markAsUnderstoodEligible: markEligible,
          };
        });

      return {
        ...def,
        ...summary,
        items,
      };
    })
  );

  const totalComplete = progress.filter(
    (p) => p.status === 'passed' || p.status === 'understood'
  ).length;

  return {
    path: {
      id: path.id,
      name: path.name,
      type: path.type,
      isActive: path.isActive,
      interviewDate: path.interviewDate?.toISOString() ?? null,
      dailyHours: path.dailyHours,
      createdAt: path.createdAt.toISOString(),
    },
    currentStage,
    totalItems: progress.length,
    totalComplete,
    dailyQueue,
    stages,
  };
}

export async function getActivePathSummary(userId: string) {
  const path = await prisma.learningPath.findFirst({
    where: { userId, isActive: true },
  });

  if (!path) return null;

  const view = await buildPathView(userId, path.id);
  if (!view) return null;

  return {
    ...view.path,
    currentStage: view.currentStage,
    totalComplete: view.totalComplete,
    totalItems: view.totalItems,
  };
}
