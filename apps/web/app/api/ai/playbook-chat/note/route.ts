import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const noteSchema = z.object({
  sessionKey: z.string().min(1),
  content: z.string().min(1),
});

/** Persist a system note (e.g. draft saved/dismissed) into playbook chat history. */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
  if (!email) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  await prisma.chatMessage.create({
    data: {
      userId: user.id,
      challengeId: parsed.data.sessionKey,
      role: 'assistant',
      content: parsed.data.content,
    },
  });

  return NextResponse.json({ ok: true });
}
