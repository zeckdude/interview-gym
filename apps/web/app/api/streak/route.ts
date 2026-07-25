import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserTimezone } from '@/lib/badges';
import { prisma } from '@/lib/prisma';
import { checkAndBreakStreak } from '@/lib/streak';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: null,
        freezesAvailable: 1,
        needsFreezeDecision: false,
        missedDate: null,
      });
    }

    const timezone = await getUserTimezone(user.id);
    const result = await checkAndBreakStreak(user.id, timezone);

    return NextResponse.json({
      currentStreak: result.currentStreak,
      longestStreak: result.longestStreak,
      lastActivityAt: result.lastActivityAt?.toISOString() ?? null,
      freezesAvailable: result.freezesAvailable,
      needsFreezeDecision: result.needsFreezeDecision,
      missedDate: result.missedDate,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
