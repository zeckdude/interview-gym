import { prisma } from '@/lib/prisma';

const WEAK_SPOT_THRESHOLD = 5;

export async function updateWeakSpot(
  userId: string,
  challengeId: string,
  passed: boolean
): Promise<void> {
  if (passed) {
    await prisma.weakSpot.updateMany({
      where: { userId, challengeId, resolved: false },
      data: { resolved: true, resolvedAt: new Date() },
    });
    return;
  }

  const spot = await prisma.weakSpot.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    create: { userId, challengeId, failedAttempts: 1 },
    update: { failedAttempts: { increment: 1 }, resolved: false, resolvedAt: null },
  });

  if (spot.failedAttempts >= WEAK_SPOT_THRESHOLD) {
    // Flagged — failedAttempts count is the indicator
  }
}

export async function getWeakSpotsForUser(userId: string) {
  return prisma.weakSpot.findMany({
    where: {
      userId,
      resolved: false,
      failedAttempts: { gte: WEAK_SPOT_THRESHOLD },
    },
  });
}

export async function getWeakSpotMap(
  userId: string
): Promise<Record<string, number>> {
  const spots = await getWeakSpotsForUser(userId);
  return Object.fromEntries(spots.map((s) => [s.challengeId, s.failedAttempts]));
}

export async function getWeakSpotForChallenge(
  userId: string,
  challengeId: string
): Promise<{ failedAttempts: number } | null> {
  const spot = await prisma.weakSpot.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });

  if (!spot || spot.resolved || spot.failedAttempts < WEAK_SPOT_THRESHOLD) {
    return null;
  }

  return { failedAttempts: spot.failedAttempts };
}

export { WEAK_SPOT_THRESHOLD };
