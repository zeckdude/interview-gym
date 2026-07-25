'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  getHighlightWhileReadingPreference,
  useListenButtonsPreference,
} from '@/hooks/useListenButtonsPreference';
import {
  buildReadAlongPlan,
  buildReadAlongPlanAsync,
  type ReadAlongPlan,
  type ReadAlongSource,
} from '@/lib/markdown-to-speech';
import {
  cancelActiveTtsPlayback,
  isTtsPlaybackCancelled,
  prefetchTts,
  speakReadAlongPlan,
} from '@/lib/tts-client';

function normalizeSource(source: ReadAlongSource | string): ReadAlongSource {
  if (typeof source === 'string') {
    return { body: source };
  }
  return source;
}

export function useReadAlongPlayback(source: ReadAlongSource | string) {
  const { highlightWhileReading } = useListenButtonsPreference();
  const normalized = useMemo(() => normalizeSource(source), [source]);
  const previewPlan = useMemo(() => buildReadAlongPlan(normalized), [normalized]);
  const [playbackPlan, setPlaybackPlan] = useState<ReadAlongPlan | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeadlineActive, setIsHeadlineActive] = useState(false);
  const [activeBodyIndex, setActiveBodyIndex] = useState(-1);
  const generationRef = useRef(0);

  const activePlan = playbackPlan ?? previewPlan;

  const stop = useCallback(() => {
    generationRef.current = cancelActiveTtsPlayback(true);
    setPlaybackPlan(null);
    setIsPlaying(false);
    setIsLoading(false);
    setIsHeadlineActive(false);
    setActiveBodyIndex(-1);
  }, []);

  const runPlayback = useCallback(
    async (options: { fromBeginning?: boolean; startBodyIndex?: number }) => {
      const generation = cancelActiveTtsPlayback(true);
      generationRef.current = generation;

      setIsLoading(true);
      setIsHeadlineActive(false);
      setActiveBodyIndex(-1);

      try {
        const asyncPlan = await buildReadAlongPlanAsync(normalized);
        if (isTtsPlaybackCancelled(generation) || !asyncPlan.fullPrepared) return;

        setPlaybackPlan(asyncPlan);
        const useHighlight = highlightWhileReading || getHighlightWhileReadingPreference();

        if (!useHighlight) {
          prefetchTts(asyncPlan.fullPrepared);
        }

        setIsLoading(false);
        setIsPlaying(true);

        await speakReadAlongPlan(asyncPlan, {
          highlightSentences: useHighlight,
          fromBeginning: options.fromBeginning,
          startBodyIndex: options.startBodyIndex,
          generation,
          onHeadlineActive: (active) => {
            if (!isTtsPlaybackCancelled(generation)) setIsHeadlineActive(active);
          },
          onBodySentenceIndex: (index) => {
            if (!isTtsPlaybackCancelled(generation)) setActiveBodyIndex(index);
          },
        });
      } catch {
        /* ignore */
      } finally {
        if (!isTtsPlaybackCancelled(generation)) {
          setPlaybackPlan(null);
          setIsPlaying(false);
          setIsHeadlineActive(false);
          setActiveBodyIndex(-1);
        }
        setIsLoading(false);
      }
    },
    [highlightWhileReading, normalized]
  );

  const play = useCallback(async () => {
    if (isPlaying) {
      stop();
      return;
    }
    await runPlayback({ fromBeginning: true });
  }, [isPlaying, runPlayback, stop]);

  const seekToBodyIndex = useCallback(
    async (index: number) => {
      if (index < 0 || index >= activePlan.bodySentences.length) return;
      await runPlayback({ startBodyIndex: index });
    },
    [activePlan.bodySentences.length, runPlayback]
  );

  return {
    plan: activePlan,
    bodySentences: activePlan.bodySentences,
    isPlaying,
    isLoading,
    isHeadlineActive,
    activeBodyIndex,
    /** @deprecated Use activeBodyIndex */
    activeSentenceIndex: activeBodyIndex,
    /** @deprecated Use bodySentences */
    sentences: activePlan.bodySentences,
    play,
    stop,
    seekToBodyIndex,
  };
}
