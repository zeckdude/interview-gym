import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { isDeepgramConfigured, requireDeepgramApiKey } from '@/lib/deepgram';

const TOKEN_TTL_SECONDS = 300;

export async function POST() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  if (!isDeepgramConfigured()) {
    return NextResponse.json({ error: 'DEEPGRAM_API_KEY is not configured' }, { status: 503 });
  }

  try {
    const apiKey = requireDeepgramApiKey();
    const response = await fetch('https://api.deepgram.com/v1/auth/grant', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ttl_seconds: TOKEN_TTL_SECONDS }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      if (response.status === 403) {
        return NextResponse.json(
          {
            error:
              'Deepgram API key cannot mint voice tokens. Create a Member-level key in the Deepgram Console and update DEEPGRAM_API_KEY.',
            detail: detail.slice(0, 200),
          },
          { status: 403 }
        );
      }
      throw new Error(`Token grant failed (${response.status}): ${detail.slice(0, 200)}`);
    }

    const data = (await response.json()) as { access_token: string; expires_in?: number };
    return NextResponse.json({
      accessToken: data.access_token,
      expiresIn: data.expires_in ?? TOKEN_TTL_SECONDS,
    });
  } catch (err) {
    console.error('[stt/token] Error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create STT token';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
