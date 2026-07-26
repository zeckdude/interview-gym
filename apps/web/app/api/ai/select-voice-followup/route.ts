import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const requestSchema = z.object({
  openingQuestion: z.string().min(1),
  latestTranscript: z.string().min(1),
  followUpBank: z.array(z.string()),
  challengeQuestions: z.array(z.string()),
  previousQuestions: z.array(z.string()),
  recommendedFollowUpType: z.enum(['followup', 'challenge']).optional(),
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

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const {
    openingQuestion,
    latestTranscript,
    followUpBank,
    challengeQuestions,
    previousQuestions,
    recommendedFollowUpType,
  } = parsed.data;

  const followUpSystemPrompt = `You are a senior engineering interviewer. You are conducting a voice interview.

The candidate just answered this question: "${openingQuestion}"
Their answer (transcript): "${latestTranscript}"

Based on their answer, choose the SINGLE best follow-up from these options:

Follow-ups (good if they gave a solid answer):
${followUpBank.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Challenge questions (use if their answer was vague, incomplete, or too easy):
${challengeQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Rules:
- Choose ONE question only
- ${recommendedFollowUpType === 'challenge' ? 'Their answer was weak — prefer a challenge question' : recommendedFollowUpType === 'followup' ? 'Their answer was solid — prefer a follow-up to go deeper' : 'If their answer was vague or missed key points, choose a challenge question; if solid, choose a follow-up'}
- Do not repeat a question already asked in this session
- Respond with ONLY the question text — no preamble, no explanation

Previous questions asked: ${previousQuestions.join(' | ') || 'none'}`;

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: followUpSystemPrompt,
      messages: [{ role: 'user', content: 'Select the best follow-up question.' }],
    });

    const question =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

    if (!question) {
      return NextResponse.json({ error: 'Empty follow-up response' }, { status: 500 });
    }

    const isChallenge = challengeQuestions.some(
      (cq) => cq.trim().toLowerCase() === question.toLowerCase()
    );

    return NextResponse.json({
      question,
      type: isChallenge ? 'challenge' : 'followup',
    });
  } catch (err) {
    console.error('[select-voice-followup] Error:', err);
    return NextResponse.json({ error: 'Failed to select follow-up' }, { status: 500 });
  }
}
