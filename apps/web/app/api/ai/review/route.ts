import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { CODE_FIX_PROMPT, CODE_REVIEW_PROMPT } from '@/lib/ai-prompts';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const requestSchema = z.object({
  challengeId: z.string().min(1),
  challengeDescription: z.string(),
  userCode: z.string(),
  language: z.enum(['javascript', 'typescript']),
  showFix: z.boolean(),
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

  const { challengeDescription, userCode, language, showFix } = parsed.data;

  const systemPrompt = showFix
    ? CODE_FIX_PROMPT
    : CODE_REVIEW_PROMPT;

  const userPrompt = showFix
    ? `Challenge:\n${challengeDescription}\n\nUser's ${language} code:\n\`\`\`${language}\n${userCode}\n\`\`\`\n\nShow the corrected code with inline comments.`
    : `Challenge:\n${challengeDescription}\n\nUser's ${language} code (NOT passing):\n\`\`\`${language}\n${userCode}\n\`\`\`\n\nIdentify what's wrong. Do NOT show corrected code.`;

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ content, showFix });
  } catch (err) {
    console.error('[review] Error:', err);
    return NextResponse.json({ error: 'Failed to generate review' }, { status: 500 });
  }
}
