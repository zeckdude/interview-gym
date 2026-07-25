import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { LessonProgressRecord } from '@/data/lessons';

export async function getLessonProgressMap(): Promise<Map<string, LessonProgressRecord>> {
  const { userId } = await auth();
  const map = new Map<string, LessonProgressRecord>();

  if (!userId) {
    return map;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        lessonProgress: {
          select: {
            lessonId: true,
            completed: true,
            miniChallengePassed: true,
            bestTimeMs: true,
            attempts: true,
            lastAttemptAt: true,
          },
        },
      },
    });

    if (!user) {
      return map;
    }

    for (const p of user.lessonProgress) {
      map.set(p.lessonId, {
        lessonId: p.lessonId,
        completed: p.completed,
        miniChallengePassed: p.miniChallengePassed,
        bestTimeMs: p.bestTimeMs,
        attempts: p.attempts,
        lastAttemptAt: p.lastAttemptAt?.toISOString() ?? null,
      });
    }
  } catch {
    // DB unavailable — return empty map
  }

  return map;
}
