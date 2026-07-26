import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVoiceQuestionById } from '@/data/voice-interviews';
import { requireAuthUser } from '@/lib/ai-auth';
import { updateSpacedRepetition } from '@/lib/badges';

const schema = z.object({
  questionId: z.string().min(1),
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const question = getVoiceQuestionById(parsed.data.questionId);
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  await updateSpacedRepetition(
    authResult.user.id,
    question.id,
    'voice-interview',
    question.difficulty,
    false
  );

  return NextResponse.json({ success: true, questionId: question.id });
}
