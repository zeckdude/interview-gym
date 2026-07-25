'use client';

import { useCallback, useState } from 'react';
import { prepareTextForSpeech, splitPreparedSentences } from '@/lib/markdown-to-speech';
import {
  prefetchTtsPrepared,
  speakPreparedText,
  cancelActiveTtsPlayback,
} from '@/lib/tts-client';

export function useDeepgramTts(text: string) {
  const prepared = prepareTextForSpeech(text);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');

  const stop = useCallback(() => {
    cancelActiveTtsPlayback(true);
    setStatus('idle');
  }, []);

  const play = useCallback(async () => {
    if (!prepared) return;

    if (status === 'playing') {
      stop();
      return;
    }

    setStatus('loading');
    try {
      for (const sentence of splitPreparedSentences(prepared)) {
        prefetchTtsPrepared(sentence);
      }
      setStatus('playing');
      await speakPreparedText(prepared, { highlightSentences: true });
    } catch {
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }, [prepared, status, stop]);

  return { status, play, stop, isPlaying: status === 'playing', isLoading: status === 'loading' };
}

export async function speakWithDeepgram(text: string): Promise<void> {
  const prepared = prepareTextForSpeech(text);
  if (!prepared) return;
  prefetchTtsPrepared(prepared);
  await speakPreparedText(prepared, { highlightSentences: true });
}

export { prefetchTts, speakPreparedText, cancelActiveTtsPlayback, stopGlobalAudioPlayback } from '@/lib/tts-client';
