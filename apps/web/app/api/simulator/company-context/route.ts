import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
  jobListingUrl: z.string().optional(),
  jobListingText: z.string().optional(),
  additionalNotes: z.string().optional(),
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

  const context = await prisma.simulatorCompanyContext.create({
    data: {
      userId: authResult.user.id,
      ...parsed.data,
    },
  });

  return NextResponse.json({ context });
}

export async function GET(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { searchParams } = new URL(request.url);
  const contextId = searchParams.get('contextId');

  if (contextId) {
    const context = await prisma.simulatorCompanyContext.findFirst({
      where: { id: contextId, userId: authResult.user.id },
      include: { interviewers: true },
    });
    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }
    return NextResponse.json({ context });
  }

  const contexts = await prisma.simulatorCompanyContext.findMany({
    where: { userId: authResult.user.id },
    include: { interviewers: true },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({ contexts });
}
