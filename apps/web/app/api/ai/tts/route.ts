import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { isDeepgramConfigured, normalizeTtsText, synthesizeSpeech } from '@/lib/deepgram';

const requestSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z.string().min(1).optional(),
  speed: z.number().min(0.7).max(1.5).optional(),
});

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (!isDeepgramConfigured()) {
    return NextResponse.json({ error: 'DEEPGRAM_API_KEY is not configured' }, { status: 503 });
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
    const audio = await synthesizeSpeech(normalizeTtsText(parsed.data.text), {
      model: parsed.data.voice,
      speed: parsed.data.speed,
    });
    return new NextResponse(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (err) {
    console.error('[tts] Error:', err);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
