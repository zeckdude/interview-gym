import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  conceptTag: z.string(),
  weight: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
});

async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const weights = await prisma.learnConceptWeight.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json({ weights });
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getDbUser(clerkId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const weight = await prisma.learnConceptWeight.upsert({
    where: {
      userId_conceptTag: {
        userId: user.id,
        conceptTag: parsed.data.conceptTag,
      },
    },
    create: {
      userId: user.id,
      conceptTag: parsed.data.conceptTag,
      weight: parsed.data.weight,
    },
    update: { weight: parsed.data.weight },
  });

  return NextResponse.json({ weight });
}
