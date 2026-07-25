'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { useFluxVoiceInput } from '@/hooks/useFluxVoiceInput';

const MAX_VOICE_RETRIES = 3;
const RETRY_BASE_MS = 2000;

export function useVoiceChatController(voiceInput: ReturnType<typeof useFluxVoiceInput>) {
  const voiceInputRef = useRef(voiceInput);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceModeRef = useRef(false);
  const isBusyRef = useRef(false);

  useEffect(() => {
    voiceInputRef.current = voiceInput;
  }, [voiceInput]);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const setVoiceModeActive = useCallback(
    (active: boolean) => {
      voiceModeRef.current = active;
      if (!active) {
        retryCountRef.current = 0;
        clearRetryTimer();
      }
    },
    [clearRetryTimer]
  );

  const setBusy = useCallback((busy: boolean) => {
    isBusyRef.current = busy;
  }, []);

  const resumeListening = useCallback(() => {
    if (!voiceModeRef.current) return;

    const attempt = () => {
      if (!voiceModeRef.current || isBusyRef.current) return;

      const vi = voiceInputRef.current;
      if (vi.isMicLive || vi.isListening || vi.isProcessing) return;

      clearRetryTimer();
      retryCountRef.current = 0;

      void vi.startListening(
        (transcript) => {
          retryCountRef.current = 0;
          void onTranscriptRef.current?.(transcript);
        },
        () => {
          if (!voiceModeRef.current || isBusyRef.current) return;
          if (retryCountRef.current >= MAX_VOICE_RETRIES) return;

          retryCountRef.current += 1;
          const delay = RETRY_BASE_MS * retryCountRef.current;
          clearRetryTimer();
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            if (!voiceModeRef.current || isBusyRef.current) return;
            resumeListening();
          }, delay);
        }
      );
    };

    queueMicrotask(attempt);
  }, [clearRetryTimer]);

  const onTranscriptRef = useRef<(text: string) => void | Promise<void>>(async () => {});

  const bindTranscriptHandler = useCallback((handler: (text: string) => void | Promise<void>) => {
    onTranscriptRef.current = handler;
  }, []);

  useEffect(() => {
    return () => {
      clearRetryTimer();
    };
  }, [clearRetryTimer]);

  return {
    resumeListening,
    bindTranscriptHandler,
    setVoiceModeActive,
    setBusy,
    clearRetryTimer,
  };
}
