import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { getAllNotesForUser, upsertChallengeNote } from '@/lib/notes';
import { prisma } from '@/lib/prisma';

const noteSchema = z.object({
  challengeId: z.string().min(1),
  content: z.string().min(1).max(500),
});

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ notes: [] });
  }

  const notes = await getAllNotesForUser(user.id);
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);

  if (!email) {
    return NextResponse.json(
      { error: 'User email not found — complete sign-in with Google or email first' },
      { status: 400 }
    );
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  const note = await upsertChallengeNote(
    user.id,
    parsed.data.challengeId,
    parsed.data.content.trim()
  );

  return NextResponse.json({ success: true, note });
}
