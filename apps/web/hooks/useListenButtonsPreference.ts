'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AUDIO_PREFERENCE_KEYS,
  DEFAULT_AUDIO_PREFERENCES,
  getAudioPreferences,
  type AudioPreferences,
  type TtsVoiceId,
  type VoiceChatSendMode,
} from '@/lib/audio-preferences';

const STORAGE_KEY = 'interview-gym-show-listen-buttons';
const HIGHLIGHT_KEY = 'interview-gym-highlight-while-reading';

export function useListenButtonsPreference() {
  const [showListenButtons, setShowListenButtonsState] = useState(true);
  const [highlightWhileReading, setHighlightWhileReadingState] = useState(true);
  const [audioPreferences, setAudioPreferencesState] = useState<AudioPreferences>(
    DEFAULT_AUDIO_PREFERENCES
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setShowListenButtonsState(stored === 'true');
      }
      const highlight = localStorage.getItem(HIGHLIGHT_KEY);
      if (highlight !== null) {
        setHighlightWhileReadingState(highlight === 'true');
      }
      setAudioPreferencesState(getAudioPreferences());
    } catch {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }, []);

  const setShowListenButtons = useCallback((value: boolean) => {
    setShowListenButtonsState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const setHighlightWhileReading = useCallback((value: boolean) => {
    setHighlightWhileReadingState(value);
    try {
      localStorage.setItem(HIGHLIGHT_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const setTtsVoice = useCallback((voice: TtsVoiceId) => {
    setAudioPreferencesState((prev) => ({ ...prev, ttsVoice: voice }));
    try {
      localStorage.setItem(AUDIO_PREFERENCE_KEYS.voice, voice);
    } catch {
      /* ignore */
    }
  }, []);

  const setTtsSpeed = useCallback((speed: number) => {
    setAudioPreferencesState((prev) => ({ ...prev, ttsSpeed: speed }));
    try {
      localStorage.setItem(AUDIO_PREFERENCE_KEYS.speed, String(speed));
    } catch {
      /* ignore */
    }
  }, []);

  const setVoiceChatSendMode = useCallback((mode: VoiceChatSendMode) => {
    setAudioPreferencesState((prev) => ({ ...prev, voiceChatSendMode: mode }));
    try {
      localStorage.setItem(AUDIO_PREFERENCE_KEYS.sendMode, mode);
    } catch {
      /* ignore */
    }
  }, []);

  const setVoiceChatKeyword = useCallback((keyword: string) => {
    const trimmed = keyword.trim() || DEFAULT_AUDIO_PREFERENCES.voiceChatKeyword;
    setAudioPreferencesState((prev) => ({ ...prev, voiceChatKeyword: trimmed }));
    try {
      localStorage.setItem(AUDIO_PREFERENCE_KEYS.keyword, trimmed);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    loaded,
    showListenButtons,
    setShowListenButtons,
    highlightWhileReading,
    setHighlightWhileReading,
    ttsVoice: audioPreferences.ttsVoice,
    setTtsVoice,
    ttsSpeed: audioPreferences.ttsSpeed,
    setTtsSpeed,
    voiceChatSendMode: audioPreferences.voiceChatSendMode,
    setVoiceChatSendMode,
    voiceChatKeyword: audioPreferences.voiceChatKeyword,
    setVoiceChatKeyword,
  };
}

export function getHighlightWhileReadingPreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(HIGHLIGHT_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
}
