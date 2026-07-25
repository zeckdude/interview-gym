import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import {
  deleteMostAskedOverride,
  getMostAskedOverridesForUser,
  upsertMostAskedOverride,
} from '@/lib/most-asked-db';
import { prisma } from '@/lib/prisma';

const overrideSchema = z.object({
  itemType: z.enum(['challenge', 'lesson', 'question']),
  itemId: z.string().min(1),
  mostAsked: z.boolean(),
});

const resetSchema = z.object({
  itemType: z.enum(['challenge', 'lesson', 'question']),
  itemId: z.string().min(1),
});

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

  const overrides = await getMostAskedOverridesForUser(user.id);
  return NextResponse.json({ overrides });
}

export async function PUT(request: Request) {
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

  const parsed = overrideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const override = await upsertMostAskedOverride(
    user.id,
    parsed.data.itemType,
    parsed.data.itemId,
    parsed.data.mostAsked
  );

  return NextResponse.json({ success: true, override });
}

export async function DELETE(request: Request) {
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

  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await deleteMostAskedOverride(user.id, parsed.data.itemType, parsed.data.itemId);
  return NextResponse.json({ success: true });
}
