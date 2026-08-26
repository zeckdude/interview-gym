import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { setActivePath } from '@/lib/paths/db';
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathId: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pathId } = await params;
  const view = await buildPathView(user.id, pathId);

  if (!view) {
    return NextResponse.json({ error: 'Path not found' }, { status: 404 });
  }

  return NextResponse.json(view);
}

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().min(1).max(200).optional(),
});

export async function PATCH(
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

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }

  const existing = await prisma.learningPath.findFirst({
    where: { id: pathId, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Path not found' }, { status: 404 });
  }

  if (parsed.data.isActive === true) {
    await setActivePath(user.id, pathId);
  } else if (parsed.data.isActive === false) {
    await prisma.learningPath.update({
      where: { id: pathId },
      data: { isActive: false },
    });
  }

  if (parsed.data.name) {
    await prisma.learningPath.update({
      where: { id: pathId },
      data: { name: parsed.data.name.trim() },
    });
  }

  const view = await buildPathView(user.id, pathId);
  return NextResponse.json({ success: true, path: view });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pathId: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pathId } = await params;

  const existing = await prisma.learningPath.findFirst({
    where: { id: pathId, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Path not found' }, { status: 404 });
  }

  await prisma.learningPath.delete({ where: { id: pathId } });

  return NextResponse.json({ success: true });
}
