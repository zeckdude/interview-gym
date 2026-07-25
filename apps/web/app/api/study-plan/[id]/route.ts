import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getClerkUserEmail } from '@/lib/auth';
import { getStudyPlanItemById } from '@/lib/study-plan-db';
import { buildProgressContext, resolveStudyPlanItem } from '@/lib/study-plan';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const item = await getStudyPlanItemById(user.id, id);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const progress = await buildProgressContext(user.id);
  const resolved = await resolveStudyPlanItem(item, progress);
  if (!resolved) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ item: resolved });
}
