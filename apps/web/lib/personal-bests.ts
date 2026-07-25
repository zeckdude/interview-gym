import { prisma } from '@/lib/prisma';

export async function updatePersonalBest(
  userId: string,
  challengeId: string,
  timeSpentMs: number,
  passed: boolean
): Promise<void> {
  if (!passed) return;

  const existing = await prisma.personalBest.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });

  if (!existing) {
    await prisma.personalBest.create({
      data: { userId, challengeId, bestTimeMs: timeSpentMs },
    });
    return;
  }

  if (timeSpentMs < existing.bestTimeMs) {
    await prisma.personalBest.update({
      where: { userId_challengeId: { userId, challengeId } },
      data: { bestTimeMs: timeSpentMs, achievedAt: new Date() },
    });
  }
}

export async function getPersonalBest(
  userId: string,
  challengeId: string
): Promise<number | null> {
  const best = await prisma.personalBest.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });
  return best?.bestTimeMs ?? null;
}

export async function getPersonalBestsForChallenges(
  userId: string,
  challengeIds: string[]
): Promise<Record<string, number>> {
  const bests = await prisma.personalBest.findMany({
    where: { userId, challengeId: { in: challengeIds } },
  });
  return Object.fromEntries(bests.map((b) => [b.challengeId, b.bestTimeMs]));
}
