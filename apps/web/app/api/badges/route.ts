import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { BADGE_DEFINITIONS } from '@/data/badges';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        badges: { orderBy: { earnedAt: 'desc' } },
      },
    });

    if (!user) {
      return NextResponse.json({
        earned: [],
        total: BADGE_DEFINITIONS.length,
        earnedCount: 0,
      });
    }

    const earnedMap = new Map(user.badges.map((b) => [b.slug, b]));

    const badges = BADGE_DEFINITIONS.map((def) => {
      const earned = earnedMap.get(def.slug);
      return {
        slug: def.slug,
        name: def.name,
        emoji: def.emoji,
        description: def.description,
        earned: !!earned,
        earnedAt: earned?.earnedAt.toISOString() ?? null,
      };
    });

    return NextResponse.json({
      badges,
      total: BADGE_DEFINITIONS.length,
      earnedCount: user.badges.length,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
