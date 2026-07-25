import {
  buildReadAlongPlan,
  prepareTextForSpeech,
  prepareTextForSpeechAsync,
  splitPreparedSentences,
  type ReadAlongPlan,
} from '@/lib/markdown-to-speech';
import { getAudioPreferences } from '@/lib/audio-preferences';
import { playAudioBlob, stopGlobalAudioPlayback } from '@/lib/audio-playback';

const ttsCache = new Map<string, Blob>();
const inflight = new Map<string, Promise<Blob>>();

let playbackGeneration = 0;

function hashText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function cacheKeyForPreparedText(prepared: string): string {
  const { ttsVoice, ttsSpeed } = getAudioPreferences();
  return `${ttsVoice}:${ttsSpeed}:${hashText(prepared)}`;
}

/** Stop playback and invalidate any in-flight read-along loops. */
export function cancelActiveTtsPlayback(immediate = true): number {
  playbackGeneration += 1;
  void stopGlobalAudioPlayback({ immediate });
  return playbackGeneration;
}

export function isTtsPlaybackCancelled(generation: number): boolean {
  return generation !== playbackGeneration;
}

export function getActivePlaybackGeneration(): number {
  return playbackGeneration;
}

async function fetchTtsBlobPrepared(prepared: string): Promise<Blob> {
  if (!prepared) {
    throw new Error('Empty TTS text');
  }

  const key = cacheKeyForPreparedText(prepared);
  const cached = ttsCache.get(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const { ttsVoice, ttsSpeed } = getAudioPreferences();

  const request = (async () => {
    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: prepared, voice: ttsVoice, speed: ttsSpeed }),
    });

    if (!res.ok) {
      throw new Error('TTS request failed');
    }

    const blob = await res.blob();
    ttsCache.set(key, blob);
    inflight.delete(key);
    return blob;
  })();

  inflight.set(key, request);
  try {
    return await request;
  } catch (err) {
    inflight.delete(key);
    throw err;
  }
}

/** Prefetch audio for text using fast sync markdown cleanup (no LLM). */
export function prefetchTts(text: string): void {
  prefetchTtsPrepared(prepareTextForSpeech(text));
}

export function prefetchTtsPrepared(prepared: string): void {
  if (!prepared) return;
  void fetchTtsBlobPrepared(prepared).catch(() => {
    /* ignore prefetch errors */
  });
}

/** Prefetch the first speakable sentence while a reply is still streaming. */
export function prefetchTtsFirstSentence(text: string): void {
  const prepared = prepareTextForSpeech(text);
  const first = splitPreparedSentences(prepared)[0];
  if (first) prefetchTtsPrepared(first);
}

export interface SpeakPlaybackOptions {
  highlightSentences?: boolean;
  onSentenceIndex?: (index: number) => void;
  startSentenceIndex?: number;
  generation?: number;
}

export async function speakPreparedText(
  prepared: string,
  options?: SpeakPlaybackOptions
): Promise<void> {
  if (!prepared) return;

  const generation = options?.generation ?? playbackGeneration;
  await stopGlobalAudioPlayback();

  if (!options?.highlightSentences) {
    if (isTtsPlaybackCancelled(generation)) return;
    const blob = await fetchTtsBlobPrepared(prepared);
    if (isTtsPlaybackCancelled(generation)) return;
    await playAudioBlob(blob);
    return;
  }

  const sentences = splitPreparedSentences(prepared);
  if (sentences.length === 0) return;

  const startIndex = Math.max(0, options.startSentenceIndex ?? 0);

  for (let index = startIndex; index < sentences.length; index += 1) {
    if (isTtsPlaybackCancelled(generation)) return;

    options.onSentenceIndex?.(index);

    if (index + 1 < sentences.length) {
      void fetchTtsBlobPrepared(sentences[index + 1]);
    }

    const blob = await fetchTtsBlobPrepared(sentences[index]);
    if (isTtsPlaybackCancelled(generation)) return;
    await playAudioBlob(blob);
  }

  if (!isTtsPlaybackCancelled(generation)) {
    options.onSentenceIndex?.(-1);
  }
}

export interface SpeakReadAlongOptions {
  highlightSentences?: boolean;
  onHeadlineActive?: (active: boolean) => void;
  onBodySentenceIndex?: (index: number) => void;
  fromBeginning?: boolean;
  startBodyIndex?: number;
  generation?: number;
}

export async function speakReadAlongPlan(
  plan: ReadAlongPlan,
  options?: SpeakReadAlongOptions
): Promise<void> {
  if (!plan.fullPrepared) return;

  const generation = options?.generation ?? playbackGeneration;
  await stopGlobalAudioPlayback();

  if (!options?.highlightSentences) {
    if (isTtsPlaybackCancelled(generation)) return;
    const blob = await fetchTtsBlobPrepared(plan.fullPrepared);
    if (isTtsPlaybackCancelled(generation)) return;
    await playAudioBlob(blob);
    return;
  }

  const segments: string[] = [];
  if (plan.headlinePrepared) segments.push(plan.headlinePrepared);
  segments.push(...plan.bodySentences);

  if (segments.length === 0) return;

  const hasHeadline = Boolean(plan.headlinePrepared);
  let startSegmentIndex = 0;

  if (options?.fromBeginning) {
    startSegmentIndex = 0;
  } else if (options?.startBodyIndex !== undefined) {
    startSegmentIndex = hasHeadline
      ? options.startBodyIndex + 1
      : options.startBodyIndex;
  }

  startSegmentIndex = Math.max(0, Math.min(startSegmentIndex, segments.length - 1));

  for (let index = startSegmentIndex; index < segments.length; index += 1) {
    if (isTtsPlaybackCancelled(generation)) return;

    const isHeadline = hasHeadline && index === 0;

    if (isHeadline) {
      options.onHeadlineActive?.(true);
      options.onBodySentenceIndex?.(-1);
    } else {
      options.onHeadlineActive?.(false);
      options.onBodySentenceIndex?.(hasHeadline ? index - 1 : index);
    }

    if (index + 1 < segments.length) {
      void fetchTtsBlobPrepared(segments[index + 1]);
    }

    const blob = await fetchTtsBlobPrepared(segments[index]);
    if (isTtsPlaybackCancelled(generation)) return;
    await playAudioBlob(blob);
  }

  if (!isTtsPlaybackCancelled(generation)) {
    options.onHeadlineActive?.(false);
    options.onBodySentenceIndex?.(-1);
  }
}

export async function speakText(
  text: string,
  options?: SpeakPlaybackOptions
): Promise<void> {
  const prepared = await prepareTextForSpeechAsync(text);
  await speakPreparedText(prepared, options);
}

export { buildReadAlongPlan };
export { stopGlobalAudioPlayback };
