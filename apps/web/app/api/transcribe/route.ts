import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { isDeepgramConfigured, transcribeAudioWithAnalytics } from '@/lib/deepgram';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (!isDeepgramConfigured()) {
    return NextResponse.json({ error: 'DEEPGRAM_API_KEY is not configured' }, { status: 503 });
  }

  const formData = await request.formData();
  const audioFile = formData.get('audio');

  if (!(audioFile instanceof Blob) || !audioFile.size) {
    return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });
  }

  if (audioFile.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: 'Audio file too large' }, { status: 413 });
  }

  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const contentType = audioFile.type || 'audio/webm';
    const result = await transcribeAudioWithAnalytics(arrayBuffer, contentType);

    if (!result.transcript) {
      return NextResponse.json({ error: 'No speech detected' }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[transcribe] Error:', err);
    const message = err instanceof Error ? err.message : 'Failed to transcribe audio';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
