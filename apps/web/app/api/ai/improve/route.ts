import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { IMPROVEMENT_PROMPT } from '@/lib/ai-prompts';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const requestSchema = z.object({
  challengeId: z.string().min(1),
  userCode: z.string(),
  language: z.enum(['javascript', 'typescript']),
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

  const { userCode, language } = parsed.data;

  const userPrompt = `Review this ${language} code for quality improvements:\n\`\`\`${language}\n${userCode}\n\`\`\``;

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: IMPROVEMENT_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ content });
  } catch (err) {
    console.error('[improve] Error:', err);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
