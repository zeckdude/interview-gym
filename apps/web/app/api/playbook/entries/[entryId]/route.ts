import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().optional().nullable(),
  questionPrompt: z.string().optional().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { entryId } = await params;
  const entry = await prisma.playbookEntry.findFirst({
    where: { id: entryId, userId: authResult.user.id },
    include: { subsections: { orderBy: { order: 'asc' } } },
  });

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { entryId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.playbookEntry.findFirst({
    where: { id: entryId, userId: authResult.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  const entry = await prisma.playbookEntry.update({
    where: { id: entryId },
    data: parsed.data,
    include: { subsections: { orderBy: { order: 'asc' } } },
  });

  return NextResponse.json({ entry });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { entryId } = await params;

  const existing = await prisma.playbookEntry.findFirst({
    where: { id: entryId, userId: authResult.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  if (existing.isSeeded) {
    return NextResponse.json({ error: 'Cannot delete seeded entries' }, { status: 400 });
  }

  await prisma.playbookEntry.delete({ where: { id: entryId } });
  return NextResponse.json({ success: true });
}
