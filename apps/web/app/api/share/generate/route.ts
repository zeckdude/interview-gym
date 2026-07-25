import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const shareToken = await prisma.shareToken.upsert({
    where: { userId: authResult.user.id },
    create: { userId: authResult.user.id },
    update: {},
  });

  const origin =
    request.headers.get('origin') ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000';

  const shareUrl = `${origin}/share/${shareToken.token}`;

  return NextResponse.json({ shareUrl, token: shareToken.token });
}
