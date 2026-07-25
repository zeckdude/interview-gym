import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { isEmailConfigured, sendReminderEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: 'Email is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL to your environment.' },
      { status: 503 }
    );
  }

  try {
    const [streak, dueForReview] = await Promise.all([
      prisma.streak.findUnique({ where: { userId: authResult.user.id } }),
      prisma.spacedRepetitionItem.count({
        where: {
          userId: authResult.user.id,
          nextReviewAt: { lte: new Date() },
        },
      }),
    ]);

    const stats = {
      streak: streak?.currentStreak ?? 0,
      dueForReview,
      lastActivity: streak?.lastActivityAt?.toISOString() ?? 'Never',
    };

    const result = await sendReminderEmail(authResult.user.email, stats);

    if (result.error) {
      return NextResponse.json(
        { error: `Resend error: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sentTo: authResult.user.email });
  } catch (err) {
    console.error('[test-email]', err);
    return NextResponse.json(
      { error: 'Failed to send test email. Check Resend configuration and sender verification.' },
      { status: 500 }
    );
  }
}
