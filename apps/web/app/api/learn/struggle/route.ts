import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  conceptTags: z.array(z.string()).min(1),
  moduleId: z.string().optional(),
  stepId: z.string().optional(),
});

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { conceptTags } = parsed.data;

  await Promise.all(
    conceptTags.map((conceptTag) =>
      prisma.learnConceptWeight.upsert({
        where: { userId_conceptTag: { userId: user.id, conceptTag } },
        create: { userId: user.id, conceptTag, weight: 1 },
        update: { weight: 1 },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
