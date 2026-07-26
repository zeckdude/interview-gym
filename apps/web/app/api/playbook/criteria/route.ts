import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const criteriaSchema = z.object({
  targetRoles: z.array(z.string()).optional(),
  targetCompanyStage: z.array(z.string()).optional(),
  targetIndustries: z.array(z.string()).optional(),
  preferredStack: z.array(z.string()).optional(),
  locationPreference: z.string().optional().nullable(),
  salaryMin: z.number().int().optional().nullable(),
  salaryMax: z.number().int().optional().nullable(),
  mustHaves: z.array(z.string()).optional(),
  dealBreakers: z.array(z.string()).optional(),
  additionalNotes: z.string().optional().nullable(),
});

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const criteria = await prisma.jobSearchCriteria.findUnique({
    where: { userId: authResult.user.id },
  });

  return NextResponse.json({ criteria });
}

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

  const parsed = criteriaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = {
    targetRoles: parsed.data.targetRoles ?? [],
    targetCompanyStage: parsed.data.targetCompanyStage ?? [],
    targetIndustries: parsed.data.targetIndustries ?? [],
    preferredStack: parsed.data.preferredStack ?? [],
    mustHaves: parsed.data.mustHaves ?? [],
    dealBreakers: parsed.data.dealBreakers ?? [],
    locationPreference: parsed.data.locationPreference ?? null,
    salaryMin: parsed.data.salaryMin ?? null,
    salaryMax: parsed.data.salaryMax ?? null,
    additionalNotes: parsed.data.additionalNotes ?? null,
  };

  const criteria = await prisma.jobSearchCriteria.upsert({
    where: { userId: authResult.user.id },
    create: { userId: authResult.user.id, ...data },
    update: data,
  });

  return NextResponse.json({ criteria });
}
