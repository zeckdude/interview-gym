import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getCategoryById } from '@/lib/playbook/categories';
import { ensurePlaybookInitialized } from '@/lib/playbook/db';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  questionPrompt: z.string().optional(),
  questionId: z.string().optional(),
});

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
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

  await ensurePlaybookInitialized(authResult.user.id);

  const categoryDef = getCategoryById(parsed.data.category);
  if (!categoryDef) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  let questionPrompt = parsed.data.questionPrompt ?? null;
  if (parsed.data.questionId) {
    const question = await prisma.playbookQuestion.findFirst({
      where: {
        id: parsed.data.questionId,
        OR: [{ isSystemDefault: true, userId: null }, { userId: authResult.user.id }],
      },
    });
    if (question) questionPrompt = question.questionText;
  }

  const maxOrder = await prisma.playbookEntry.aggregate({
    where: { userId: authResult.user.id, category: parsed.data.category },
    _max: { order: true },
  });

  const subsectionsToCreate =
    categoryDef.subsectionTemplate?.map((s, i) => ({
      label: s.label,
      order: i,
    })) ?? [];

  const entry = await prisma.playbookEntry.create({
    data: {
      userId: authResult.user.id,
      category: parsed.data.category,
      title: parsed.data.title,
      questionPrompt,
      order: (maxOrder._max.order ?? -1) + 1,
      subsections: subsectionsToCreate.length
        ? { create: subsectionsToCreate }
        : {
            create: [{ label: 'Answer', order: 0 }],
          },
    },
    include: { subsections: { orderBy: { order: 'asc' } } },
  });

  return NextResponse.json({ entry });
}
