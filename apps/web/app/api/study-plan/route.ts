import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import {
  addStudyPlanItem,
  getStudyPlanItemsForUser,
  removeStudyPlanItem,
} from '@/lib/study-plan-db';
import {
  buildProgressContext,
  getPickerCandidates,
  resolveStudyPlanItem,
} from '@/lib/study-plan';
import { prisma } from '@/lib/prisma';

const addSchema = z.object({
  itemType: z.enum(['challenge', 'lesson', 'user-challenge']),
  itemId: z.string().min(1),
  source: z.enum(['challenge', 'lesson', 'generated', 'simulator', 'picker']),
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

export async function GET(request: Request) {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get('picker') === '1') {
    const search = searchParams.get('search') ?? '';
    return NextResponse.json(getPickerCandidates(search));
  }

  const items = await getStudyPlanItemsForUser(user.id);
  const progress = await buildProgressContext(user.id);
  const resolved = (
    await Promise.all(items.map((item) => resolveStudyPlanItem(item, progress)))
  ).filter(Boolean);

  return NextResponse.json({ items: resolved });
}

export async function POST(request: Request) {
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

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const item = await addStudyPlanItem(
    user.id,
    parsed.data.itemType,
    parsed.data.itemId,
    parsed.data.source
  );

  const progress = await buildProgressContext(user.id);
  const resolved = await resolveStudyPlanItem(item, progress);

  return NextResponse.json({ success: true, item: resolved });
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

  const parsed = z.object({ id: z.string().min(1) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }

  await removeStudyPlanItem(user.id, parsed.data.id);
  return NextResponse.json({ success: true });
}
