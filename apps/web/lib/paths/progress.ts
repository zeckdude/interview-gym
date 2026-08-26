import { prisma } from '@/lib/prisma';
import {
  getAllStageItemsForPathType,
  getPathProgress,
  reconcileStageUnlocks,
} from '@/lib/paths/db';
import { getCurrentStage } from '@/lib/paths/gating';
import { PATH_ITEM_ID_REMAP } from '@/lib/paths/id-remap';
import { getPathItemHref, getPathItemTitle } from '@/lib/paths/item-resolver';
import { STAGE_DEFINITIONS } from '@/lib/paths/stage-definitions';
import { createAppNotification } from '@/lib/notifications';
import type { PathItemType, PathItemStatus, PathQueueItem } from '@/lib/paths/types';

export async function recordPathItemAttempt(
  userId: string,
  itemId: string,
  _itemType: PathItemType,
  passed: boolean
): Promise<void> {
  const legacyIds = Object.entries(PATH_ITEM_ID_REMAP)
    .filter(([, newId]) => newId === itemId)
    .map(([oldId]) => oldId);
  const matchIds = [itemId, ...legacyIds];

  const progressRecords = await prisma.pathItemProgress.findMany({
    where: { userId, itemId: { in: matchIds } },
    include: { path: true },
  });

  if (progressRecords.length === 0) return;

  for (const progress of progressRecords) {
    if (progress.status === 'locked') continue;

    if (passed) {
      await prisma.pathItemProgress.update({
        where: { id: progress.id },
        data: {
          status: 'passed',
          passedAt: new Date(),
          attempts: { increment: 1 },
        },
      });
    } else if (progress.status !== 'passed' && progress.status !== 'understood') {
      await prisma.pathItemProgress.update({
        where: { id: progress.id },
        data: {
          status: 'attempted',
          attempts: { increment: 1 },
        },
      });
    }

    const { unlockedStage } = await reconcileStageUnlocks(userId, progress.pathId);

    if (unlockedStage && progress.path.isActive) {
      const stageDef = STAGE_DEFINITIONS[unlockedStage as 1 | 2 | 3];
      await createAppNotification({
        userId,
        type: 'path_stage_unlocked',
        title: `${stageDef.label} unlocked!`,
        body: stageDef.unlockMessage,
        href: '/my-path',
      });
    }
  }
}

export async function markPathItemUnderstood(
  userId: string,
  pathId: string,
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  const progress = await prisma.pathItemProgress.findUnique({
    where: { pathId_itemId: { pathId, itemId } },
  });

  if (!progress || progress.userId !== userId) {
    return { success: false, error: 'Item not found' };
  }

  if (progress.status === 'locked') {
    return { success: false, error: 'Item is locked' };
  }

  if (progress.attempts < 3) {
    return { success: false, error: 'Need at least 3 attempts before marking as understood' };
  }

  if (progress.status === 'passed') {
    return { success: false, error: 'Item already passed' };
  }

  await prisma.pathItemProgress.update({
    where: { id: progress.id },
    data: {
      status: 'understood',
      markedUnderstood: true,
      understoodAt: new Date(),
    },
  });

  await prisma.weakSpot.upsert({
    where: { userId_challengeId: { userId, challengeId: itemId } },
    create: { userId, challengeId: itemId, failedAttempts: 3 },
    update: { failedAttempts: { increment: 1 }, resolved: false, resolvedAt: null },
  });

  await reconcileStageUnlocks(userId, pathId);

  return { success: true };
}

export async function getDailyQueue(
  userId: string,
  pathId: string,
  maxItems = 5
): Promise<PathQueueItem[]> {
  const path = await prisma.learningPath.findFirst({
    where: { id: pathId, userId },
  });

  if (!path) return [];

  const currentStage = await getCurrentStage(userId, pathId);
  const stageItems = await getAllStageItemsForPathType(path.type as 'fe' | 'be' | 'fullstack');
  const progress = await getPathProgress(userId, pathId);
  const progressMap = new Map(progress.map((p) => [p.itemId, p]));

  const availableStageItems = stageItems
    .filter((item) => item.stage <= currentStage)
    .map((item) => {
      const p = progressMap.get(item.itemId);
      return {
        ...item,
        status: (p?.status ?? 'locked') as PathItemStatus,
        attempts: p?.attempts ?? 0,
      };
    })
    .filter((item) => item.status === 'available' || item.status === 'attempted');

  const mostAskedUnattempted = availableStageItems.filter(
    (i) => i.mostAsked && i.status === 'available'
  );
  const failed = availableStageItems
    .filter((i) => i.status === 'attempted')
    .sort((a, b) => b.attempts - a.attempts);
  const unattempted = availableStageItems.filter(
    (i) => i.status === 'available' && !i.mostAsked
  );

  const queue = [...mostAskedUnattempted, ...failed, ...unattempted].slice(0, maxItems);

  return queue.map((item) => ({
    itemId: item.itemId,
    itemType: item.itemType as PathItemType,
    stage: item.stage,
    order: item.order,
    mostAsked: item.mostAsked,
    status: item.status,
    attempts: item.attempts,
    title: getPathItemTitle(item.itemId, item.itemType as PathItemType),
    href: getPathItemHref(item.itemId, item.itemType as PathItemType),
  }));
}
