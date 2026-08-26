import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { createLearningPath, getUserPaths, setActivePath } from '@/lib/paths/db';
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

const createSchema = z.object({
  type: z.enum(['fe', 'be', 'fullstack']),
  name: z.string().min(1).max(200),
  setActive: z.boolean().optional().default(true),
});

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const paths = await getUserPaths(user.id);
  return NextResponse.json({
    paths: paths.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      isActive: p.isActive,
      interviewDate: p.interviewDate?.toISOString() ?? null,
      dailyHours: p.dailyHours,
      createdAt: p.createdAt.toISOString(),
    })),
  });
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const path = await createLearningPath(
    user.id,
    parsed.data.type,
    parsed.data.name.trim(),
    parsed.data.setActive
  );

  const view = await buildPathView(user.id, path.id);

  return NextResponse.json({ success: true, path: view });
}
