import { prisma } from '@/lib/prisma';
import type {
  StudyPlanItemRecord,
  StudyPlanItemType,
  StudyPlanSource,
} from '@/lib/study-plan';

export async function getStudyPlanItemsForUser(userId: string): Promise<StudyPlanItemRecord[]> {
  const rows = await prisma.studyPlanItem.findMany({
    where: { userId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return rows.map((row) => ({
    id: row.id,
    itemType: row.itemType as StudyPlanItemType,
    itemId: row.itemId,
    source: row.source as StudyPlanSource,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function addStudyPlanItem(
  userId: string,
  itemType: StudyPlanItemType,
  itemId: string,
  source: StudyPlanSource
): Promise<StudyPlanItemRecord> {
  const maxSort = await prisma.studyPlanItem.aggregate({
    where: { userId },
    _max: { sortOrder: true },
  });

  const row = await prisma.studyPlanItem.upsert({
    where: {
      userId_itemType_itemId: {
        userId,
        itemType,
        itemId,
      },
    },
    update: { source },
    create: {
      userId,
      itemType,
      itemId,
      source,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });

  return {
    id: row.id,
    itemType: row.itemType as StudyPlanItemType,
    itemId: row.itemId,
    source: row.source as StudyPlanSource,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function removeStudyPlanItem(userId: string, id: string): Promise<boolean> {
  const result = await prisma.studyPlanItem.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}

export async function getStudyPlanItemById(
  userId: string,
  id: string
): Promise<StudyPlanItemRecord | null> {
  const row = await prisma.studyPlanItem.findFirst({
    where: { id, userId },
  });

  if (!row) return null;

  return {
    id: row.id,
    itemType: row.itemType as StudyPlanItemType,
    itemId: row.itemId,
    source: row.source as StudyPlanSource,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  };
}
