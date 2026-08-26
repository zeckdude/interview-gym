import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { setActivePath } from '@/lib/paths/db';
import { getActivePathSummary } from '@/lib/paths/view';
import { prisma } from '@/lib/prisma';

async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) return null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
    select: { id: true },
  });
}

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = await getActivePathSummary(user.id);
  return NextResponse.json({ activePath: summary });
}

const patchSchema = z.object({
  pathId: z.string().min(1),
});

export async function PATCH(request: Request) {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }

  const path = await setActivePath(user.id, parsed.data.pathId);
  if (!path) {
    return NextResponse.json({ error: 'Path not found' }, { status: 404 });
  }

  const summary = await getActivePathSummary(user.id);
  return NextResponse.json({ success: true, activePath: summary });
}
