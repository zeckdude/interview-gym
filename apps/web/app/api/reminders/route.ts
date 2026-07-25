import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isEmailConfigured, sendReminderEmail } from '@/lib/email';
import { shouldSendReminder } from '@/lib/reminders';
import { getStartOfDayInTimezone } from '@/lib/timezone';

export async function POST(req: Request) {
  const secret = req.headers.get('x-cron-secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: 'Email is not configured' },
      { status: 503 }
    );
  }

  try {
    const users = await prisma.userPreferences.findMany({
      where: { reminderEnabled: true },
      include: {
        user: {
          include: { streak: true },
        },
      },
    });

    const now = new Date();
    const emailsSent: string[] = [];

    for (const pref of users) {
      if (!shouldSendReminder(pref, now)) continue;

      const todayStart = getStartOfDayInTimezone(now, pref.timezone);
      const todayAttempts = await prisma.attempt.count({
        where: {
          userId: pref.userId,
          createdAt: { gte: todayStart },
        },
      });

      if (todayAttempts > 0) continue;

      const dueForReview = await prisma.spacedRepetitionItem.count({
        where: {
          userId: pref.userId,
          nextReviewAt: { lte: now },
        },
      });

      const stats = {
        streak: pref.user.streak?.currentStreak ?? 0,
        dueForReview,
        lastActivity:
          pref.user.streak?.lastActivityAt?.toISOString() ?? 'Never',
      };

      const result = await sendReminderEmail(pref.user.email, stats);
      if (result.error) {
        console.error(`[reminders] Failed to send to ${pref.user.email}:`, result.error);
        continue;
      }

      emailsSent.push(pref.user.email);
    }

    return NextResponse.json({ sent: emailsSent.length, emails: emailsSent });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
