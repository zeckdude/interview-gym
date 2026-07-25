import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { getUnreadCount } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: authResult.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    getUnreadCount(authResult.user.id),
  ]);

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      href: n.href,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount,
  });
}

export async function PATCH() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  await prisma.notification.updateMany({
    where: { userId: authResult.user.id, read: false },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
