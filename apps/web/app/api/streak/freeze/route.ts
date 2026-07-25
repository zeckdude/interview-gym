import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAndAwardBadges, getUserTimezone } from '@/lib/badges';
import { checkAndBreakStreak, useStreakFreeze } from '@/lib/streak';

export async function POST() {
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const timezone = await getUserTimezone(user.id);
    const updated = await useStreakFreeze(user.id, timezone);

    if (!updated) {
      return NextResponse.json({ error: 'Cannot use freeze right now' }, { status: 400 });
    }

    const newBadges = await checkAndAwardBadges(user.id);

    return NextResponse.json({
      success: true,
      currentStreak: updated.currentStreak,
      freezesAvailable: updated.freezesAvailable,
      newBadges,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
