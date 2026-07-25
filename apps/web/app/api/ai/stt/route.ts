import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { isDeepgramConfigured, transcribeAudio } from '@/lib/deepgram';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (!isDeepgramConfigured()) {
    return NextResponse.json({ error: 'DEEPGRAM_API_KEY is not configured' }, { status: 503 });
  }

  const contentType = request.headers.get('content-type') ?? 'audio/webm';
  const audio = await request.arrayBuffer();

  if (!audio.byteLength) {
    return NextResponse.json({ error: 'Empty audio payload' }, { status: 400 });
  }

  if (audio.byteLength > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: 'Audio file too large' }, { status: 413 });
  }

  try {
    const transcript = await transcribeAudio(audio, contentType);
    if (!transcript) {
      return NextResponse.json({ error: 'No speech detected' }, { status: 422 });
    }
    return NextResponse.json({ transcript });
  } catch (err) {
    console.error('[stt] Error:', err);
    const message = err instanceof Error ? err.message : 'Failed to transcribe audio';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
