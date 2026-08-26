import { prisma } from '@/lib/prisma';
import { getCuratedItemsForPathType } from '@/lib/paths';
import { PATH_ITEM_ID_REMAP } from '@/lib/paths/id-remap';
import type { PathItemStatus, PathItemType, PathType } from '@/lib/paths/types';

export async function getStageItemsFromDb(pathType: PathType, stage: number) {
  return prisma.pathStageItem.findMany({
    where: { pathType, stage },
    orderBy: { order: 'asc' },
  });
}

export async function getAllStageItemsForPathType(pathType: PathType) {
  return prisma.pathStageItem.findMany({
    where: { pathType },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }],
  });
}

export async function getProgressForItems(
  userId: string,
  pathId: string,
  itemIds: string[]
) {
  if (itemIds.length === 0) return [];

  return prisma.pathItemProgress.findMany({
    where: { userId, pathId, itemId: { in: itemIds } },
  });
}

export async function getItemProgress(
  userId: string,
  pathId: string,
  itemId: string
) {
  return prisma.pathItemProgress.findUnique({
    where: { pathId_itemId: { pathId, itemId } },
  });
}

export async function getPathProgress(userId: string, pathId: string) {
  return prisma.pathItemProgress.findMany({
    where: { userId, pathId },
    orderBy: [{ stage: 'asc' }, { createdAt: 'asc' }],
  });
}

function isCompleteStatus(status: string): boolean {
  return status === 'passed' || status === 'understood';
}

async function resolveInitialStatus(
  userId: string,
  itemId: string,
  itemType: PathItemType,
  stage: number,
  stageUnlocked: boolean
): Promise<{ status: PathItemStatus; attempts: number }> {
  if (!stageUnlocked) {
    return { status: 'locked', attempts: 0 };
  }

  if (itemType === 'lesson') {
    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: itemId } },
    });
    if (lessonProgress?.completed) {
      return { status: 'passed', attempts: lessonProgress.attempts };
    }
    if (lessonProgress && lessonProgress.attempts > 0) {
      return { status: 'attempted', attempts: lessonProgress.attempts };
    }
  } else {
    const attempts = await prisma.attempt.findMany({
      where: { userId, challengeId: itemId },
      orderBy: { createdAt: 'desc' },
    });
    if (attempts.some((a) => a.passed)) {
      return { status: 'passed', attempts: attempts.length };
    }
    if (attempts.length > 0) {
      return { status: 'attempted', attempts: attempts.length };
    }
  }

  return { status: 'available', attempts: 0 };
}

async function isStageComplete(
  userId: string,
  pathId: string,
  stage: number
): Promise<boolean> {
  const items = await prisma.pathItemProgress.findMany({
    where: { userId, pathId, stage },
  });

  if (items.length === 0) return false;

  return items.every((item) => isCompleteStatus(item.status));
}

export async function initializePathProgress(
  userId: string,
  pathId: string,
  pathType: PathType
): Promise<void> {
  const stageItems = await getAllStageItemsForPathType(pathType);

  const records = await Promise.all(
    stageItems.map(async (item) => {
      const stageUnlocked = item.stage === 1;

      const initial = await resolveInitialStatus(
        userId,
        item.itemId,
        item.itemType as PathItemType,
        item.stage,
        stageUnlocked
      );

      return {
        pathId,
        userId,
        itemId: item.itemId,
        itemType: item.itemType,
        stage: item.stage,
        status: initial.status,
        attempts: initial.attempts,
        passedAt: initial.status === 'passed' ? new Date() : null,
      };
    })
  );

  await prisma.pathItemProgress.createMany({ data: records });

  await reconcileStageUnlocks(userId, pathId);
}

export async function reconcileStageUnlocks(
  userId: string,
  pathId: string
): Promise<{ unlockedStage?: number }> {
  let unlockedStage: number | undefined;

  for (const stage of [1, 2] as const) {
    const complete = await isStageComplete(userId, pathId, stage);
    if (!complete) break;

    const nextStage = stage + 1;
    const lockedItems = await prisma.pathItemProgress.findMany({
      where: { userId, pathId, stage: nextStage, status: 'locked' },
    });

    if (lockedItems.length > 0) {
      await prisma.pathItemProgress.updateMany({
        where: {
          userId,
          pathId,
          stage: nextStage,
          status: 'locked',
        },
        data: { status: 'available' },
      });
      unlockedStage = nextStage;
    }
  }

  return { unlockedStage };
}

export async function createLearningPath(
  userId: string,
  pathType: PathType,
  name: string,
  setActive = true
) {
  const existingItems = await prisma.pathStageItem.count({
    where: { pathType },
  });

  if (existingItems === 0) {
    await seedCuratedPathStageItems();
  }

  if (setActive) {
    await prisma.learningPath.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  const path = await prisma.learningPath.create({
    data: {
      userId,
      type: pathType,
      name,
      isActive: setActive,
    },
  });

  await initializePathProgress(userId, path.id, pathType);

  return path;
}

export async function getUserPaths(userId: string) {
  return prisma.learningPath.findMany({
    where: { userId },
    orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
  });
}

export async function getActivePath(userId: string) {
  return prisma.learningPath.findFirst({
    where: { userId, isActive: true },
  });
}

export async function setActivePath(userId: string, pathId: string) {
  const path = await prisma.learningPath.findFirst({
    where: { id: pathId, userId },
  });

  if (!path) return null;

  await prisma.learningPath.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  return prisma.learningPath.update({
    where: { id: pathId },
    data: { isActive: true },
  });
}

export async function remapLegacyPathItems(): Promise<void> {
  for (const [oldId, newId] of Object.entries(PATH_ITEM_ID_REMAP)) {
    if (oldId === newId) continue;

    const stageItems = await prisma.pathStageItem.findMany({
      where: { itemId: oldId },
    });

    for (const stageItem of stageItems) {
      const existingNew = await prisma.pathStageItem.findUnique({
        where: {
          pathType_itemId: { pathType: stageItem.pathType, itemId: newId },
        },
      });

      if (existingNew) {
        await prisma.pathStageItem.delete({ where: { id: stageItem.id } });
      } else {
        await prisma.pathStageItem.update({
          where: { id: stageItem.id },
          data: { itemId: newId },
        });
      }
    }

    const progressRows = await prisma.pathItemProgress.findMany({
      where: { itemId: oldId },
    });

    for (const row of progressRows) {
      const existingNew = await prisma.pathItemProgress.findUnique({
        where: { pathId_itemId: { pathId: row.pathId, itemId: newId } },
      });

      if (existingNew) {
        await prisma.pathItemProgress.delete({ where: { id: row.id } });
      } else {
        await prisma.pathItemProgress.update({
          where: { id: row.id },
          data: { itemId: newId },
        });
      }
    }
  }
}

export async function seedCuratedPathStageItems(): Promise<void> {
  await remapLegacyPathItems();

  const pathTypes: PathType[] = ['fe', 'be', 'fullstack'];
  const validKeys = new Set<string>();

  for (const pathType of pathTypes) {
    const items = getCuratedItemsForPathType(pathType);

    for (const item of items) {
      validKeys.add(`${pathType}:${item.itemId}`);

      await prisma.pathStageItem.upsert({
        where: {
          pathType_itemId: { pathType, itemId: item.itemId },
        },
        create: {
          pathType,
          stage: item.stage,
          itemId: item.itemId,
          itemType: item.itemType,
          mostAsked: item.mostAsked,
          order: item.order,
          aiEvaluated: false,
        },
        update: {
          stage: item.stage,
          itemType: item.itemType,
          mostAsked: item.mostAsked,
          order: item.order,
        },
      });
    }
  }

  const allStageItems = await prisma.pathStageItem.findMany({
    where: { aiEvaluated: false },
  });

  for (const row of allStageItems) {
    if (!validKeys.has(`${row.pathType}:${row.itemId}`)) {
      await prisma.pathStageItem.delete({ where: { id: row.id } });
    }
  }
}
