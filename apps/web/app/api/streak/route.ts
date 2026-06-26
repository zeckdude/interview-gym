import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeStreak } from '@/lib/streak';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        attempts: {
          select: { createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: null,
      });
    }

    const { currentStreak, longestStreak, lastActivityAt } = computeStreak(
      user.attempts.map((a) => a.createdAt)
    );

    return NextResponse.json({
      currentStreak,
      longestStreak,
      lastActivityAt: lastActivityAt?.toISOString() ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
