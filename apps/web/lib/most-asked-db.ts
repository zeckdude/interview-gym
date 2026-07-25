import { prisma } from '@/lib/prisma';
import type { MostAskedItemType, MostAskedOverrideRecord } from '@/lib/most-asked';

export async function getMostAskedOverridesForUser(
  userId: string
): Promise<MostAskedOverrideRecord[]> {
  const rows = await prisma.mostAskedOverride.findMany({
    where: { userId },
    select: {
      itemType: true,
      itemId: true,
      mostAsked: true,
    },
  });

  return rows.map((row) => ({
    itemType: row.itemType as MostAskedItemType,
    itemId: row.itemId,
    mostAsked: row.mostAsked,
  }));
}

export async function upsertMostAskedOverride(
  userId: string,
  itemType: MostAskedItemType,
  itemId: string,
  mostAsked: boolean
): Promise<MostAskedOverrideRecord> {
  const row = await prisma.mostAskedOverride.upsert({
    where: {
      userId_itemType_itemId: {
        userId,
        itemType,
        itemId,
      },
    },
    update: { mostAsked },
    create: {
      userId,
      itemType,
      itemId,
      mostAsked,
    },
    select: {
      itemType: true,
      itemId: true,
      mostAsked: true,
    },
  });

  return {
    itemType: row.itemType as MostAskedItemType,
    itemId: row.itemId,
    mostAsked: row.mostAsked,
  };
}

export async function deleteMostAskedOverride(
  userId: string,
  itemType: MostAskedItemType,
  itemId: string
): Promise<boolean> {
  const result = await prisma.mostAskedOverride.deleteMany({
    where: { userId, itemType, itemId },
  });
  return result.count > 0;
}
