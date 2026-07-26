import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { ensurePlaybookInitialized, ensurePlaybookProfile } from '@/lib/playbook/db';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  await ensurePlaybookInitialized(authResult.user.id);
  await ensurePlaybookProfile(authResult.user.id);

  const [profile, criteria, entries, questions] = await Promise.all([
    prisma.playbookProfile.findUnique({ where: { userId: authResult.user.id } }),
    prisma.jobSearchCriteria.findUnique({ where: { userId: authResult.user.id } }),
    prisma.playbookEntry.findMany({
      where: { userId: authResult.user.id },
      include: { subsections: { orderBy: { order: 'asc' } } },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }),
    prisma.playbookQuestion.findMany({
      where: {
        OR: [{ isSystemDefault: true, userId: null }, { userId: authResult.user.id }],
      },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  return NextResponse.json({ profile, criteria, entries, questions });
}

const profileSchema = z.object({
  linkedInUrl: z.string().optional().nullable(),
  linkedInText: z.string().optional().nullable(),
  resumeText: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  personalWebsite: z.string().optional().nullable(),
  additionalContext: z.string().optional().nullable(),
  onboardingComplete: z.boolean().optional(),
});

export async function PUT(request: Request) {
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

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await ensurePlaybookInitialized(authResult.user.id);

  const profile = await prisma.playbookProfile.upsert({
    where: { userId: authResult.user.id },
    create: { userId: authResult.user.id, ...parsed.data },
    update: parsed.data,
  });

  return NextResponse.json({ profile });
}
