const TTS_MODEL = 'aura-2-thalia-en';
const STT_MODEL = 'nova-3';
const MAX_TTS_CHARS = 4000;

export const DEFAULT_TTS_VOICE = TTS_MODEL;
export const DEFAULT_TTS_SPEED = 1;

export function isDeepgramConfigured(): boolean {
  return Boolean(process.env.DEEPGRAM_API_KEY?.trim());
}

export function requireDeepgramApiKey(): string {
  const key = process.env.DEEPGRAM_API_KEY?.trim();
  if (!key) {
    throw new Error('DEEPGRAM_API_KEY is not configured');
  }
  return key;
}

export function normalizeTtsText(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= MAX_TTS_CHARS) return trimmed;
  return `${trimmed.slice(0, MAX_TTS_CHARS - 3)}...`;
}

export async function synthesizeSpeech(
  text: string,
  options?: { model?: string; speed?: number }
): Promise<ArrayBuffer> {
  const apiKey = requireDeepgramApiKey();
  const normalized = normalizeTtsText(text);
  const model = options?.model?.trim() || TTS_MODEL;
  const speed = options?.speed ?? DEFAULT_TTS_SPEED;

  const url = new URL('https://api.deepgram.com/v1/speak');
  url.searchParams.set('model', model);
  url.searchParams.set('encoding', 'mp3');
  url.searchParams.set('speed', String(speed));

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: normalized }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Deepgram TTS failed (${response.status}): ${detail.slice(0, 200)}`);
  }

  return response.arrayBuffer();
}

export async function transcribeAudio(
  audio: ArrayBuffer,
  contentType: string
): Promise<string> {
  const apiKey = requireDeepgramApiKey();

  const url = new URL('https://api.deepgram.com/v1/listen');
  url.searchParams.set('model', STT_MODEL);
  url.searchParams.set('smart_format', 'true');
  url.searchParams.set('punctuate', 'true');

  // Deepgram expects a simple container mime type — not "audio/webm;codecs=opus"
  const normalizedType = contentType.split(';')[0].trim() || 'audio/webm';

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': normalizedType,
    },
    body: audio,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Deepgram STT failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> };
  };

  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? '';
}
