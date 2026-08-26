import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { markPathItemUnderstood } from '@/lib/paths/progress';
import { buildPathView } from '@/lib/paths/view';
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

const understoodSchema = z.object({
  itemId: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ pathId: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pathId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = understoodSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }

  const result = await markPathItemUnderstood(user.id, pathId, parsed.data.itemId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const view = await buildPathView(user.id, pathId);
  return NextResponse.json({ success: true, path: view });
}
