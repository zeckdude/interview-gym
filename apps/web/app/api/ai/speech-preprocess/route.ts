import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { prepareTextForSpeechBase } from '@/lib/markdown-to-speech';

const requestSchema = z.object({
  text: z.string().min(1).max(8000),
});

const preprocessCache = new Map<string, string>();

function hashText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

const SYSTEM_PROMPT = `You prepare instructional markdown for text-to-speech read by a developer learning to code.

Rules:
1. Fenced code blocks (triple backticks): replace with the phrase "code example"
2. Inline code in single backticks: rewrite as a short natural spoken phrase a developer would understand. Example: fs.readFileSync(path, 'utf8') becomes "calling fs dot readFileSync with path and the string utf-8 as arguments"
3. Remove all remaining markdown formatting (headings, bold, links, bullets)
4. Keep the same meaning, order, and approximate length
5. Return ONLY plain speakable text — no markdown, no backticks, no bullet symbols

Do not add commentary. Output the speakable text only.`;

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

  const input = parsed.data.text.trim();
  const cacheKey = hashText(input);
  const cached = preprocessCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ prepared: cached });
  }

  const hasInlineCode = /`[^`]+`/.test(input);
  const hasFencedCode = /```[\s\S]*?```/.test(input);

  if (!hasInlineCode && !hasFencedCode) {
    const prepared = prepareTextForSpeechBase(input);
    preprocessCache.set(cacheKey, prepared);
    return NextResponse.json({ prepared });
  }

  try {
    requireApiKey();
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: Math.min(AI_MAX_TOKENS, 2048),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input }],
    });

    const block = response.content[0];
    const prepared =
      block.type === 'text'
        ? block.text.replace(/\s+/g, ' ').trim()
        : prepareTextForSpeechBase(input);

    preprocessCache.set(cacheKey, prepared);
    return NextResponse.json({ prepared });
  } catch (err) {
    console.error('[speech-preprocess] Error:', err);
    const fallback = prepareTextForSpeechBase(input);
    return NextResponse.json({ prepared: fallback });
  }
}
