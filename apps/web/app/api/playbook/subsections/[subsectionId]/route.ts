import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { uploadPlaybookAudio } from '@/lib/r2';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  textContent: z.string().optional().nullable(),
  transcript: z.string().optional().nullable(),
  audioDataUrl: z.string().optional().nullable(),
  audioContentType: z.string().optional(),
  fillerWordCount: z.number().optional().nullable(),
  wordsPerMinute: z.number().optional().nullable(),
  aiFeedback: z.string().optional().nullable(),
  aiSummary: z.string().optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ subsectionId: string }> }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { subsectionId } = await params;

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

  const subsection = await prisma.playbookSubsection.findFirst({
    where: { id: subsectionId },
    include: { entry: true },
  });

  if (!subsection || subsection.entry.userId !== authResult.user.id) {
    return NextResponse.json({ error: 'Subsection not found' }, { status: 404 });
  }

  let audioUrl = subsection.audioUrl;
  if (parsed.data.audioDataUrl?.startsWith('data:')) {
    const match = parsed.data.audioDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const contentType = parsed.data.audioContentType ?? match[1];
      const buffer = Buffer.from(match[2], 'base64');
      audioUrl = await uploadPlaybookAudio(
        buffer,
        authResult.user.id,
        subsection.entryId,
        subsectionId,
        contentType
      );
    }
  }

  const updated = await prisma.playbookSubsection.update({
    where: { id: subsectionId },
    data: {
      textContent: parsed.data.textContent,
      transcript: parsed.data.transcript,
      fillerWordCount: parsed.data.fillerWordCount,
      wordsPerMinute: parsed.data.wordsPerMinute,
      aiFeedback: parsed.data.aiFeedback,
      aiSummary: parsed.data.aiSummary,
      ...(audioUrl !== subsection.audioUrl ? { audioUrl } : {}),
    },
  });

  return NextResponse.json({ subsection: updated });
}
