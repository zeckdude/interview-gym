import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { getChallengeById } from '@/data';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  challengeId: z.string().min(1),
  challengeType: z.enum(['builtin', 'user']).default('builtin'),
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

  const { challengeId, challengeType } = parsed.data;

  let title: string;
  let solution: string;
  let concepts: string[];

  if (challengeType === 'user') {
    const userChallenge = await prisma.userChallenge.findFirst({
      where: { id: challengeId, userId: authResult.user.id },
    });
    if (!userChallenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }
    title = userChallenge.title;
    solution = userChallenge.solutionJs;
    concepts = userChallenge.concepts;
  } else {
    const challenge = getChallengeById(challengeId);
    if (!challenge || challenge.comingSoon) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }
    title = challenge.title;
    solution = challenge.solution.javascript;
    concepts = challenge.concepts;
  }

  const prompt = `Generate a clear, spoken-word explanation of this coding challenge solution.

Challenge: ${title}
Solution:
${solution}
Key concepts: ${concepts.join(', ')}

Write as if you're talking through the solution to a colleague.
Structure: (1) what the challenge asks for, (2) the approach, (3) walk through the key lines, (4) common mistakes to avoid.
Keep it under 200 words. Natural speech rhythm — no bullet points, no headers.`;

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const script =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

    if (!script) {
      return NextResponse.json({ error: 'Failed to generate narration' }, { status: 500 });
    }

    return NextResponse.json({ script });
  } catch (err) {
    console.error('[narration] Error:', err);
    return NextResponse.json({ error: 'Failed to generate narration' }, { status: 500 });
  }
}
