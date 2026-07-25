import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getNoteForChallenge, markNoteHintUsed } from '@/lib/notes';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { challengeId: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ note: null });
  }

  const note = await getNoteForChallenge(user.id, params.challengeId);
  return NextResponse.json({ note });
}

export async function PATCH(_request: Request, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await markNoteHintUsed(user.id, params.challengeId);
  return NextResponse.json({ success: true });
}
