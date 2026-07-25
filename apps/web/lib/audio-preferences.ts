export const TTS_VOICES = [
  { id: 'aura-2-thalia-en', label: 'Thalia — warm, conversational (default)' },
  { id: 'aura-2-helena-en', label: 'Helena — clear, professional' },
  { id: 'aura-2-apollo-en', label: 'Apollo — confident, direct' },
  { id: 'aura-2-andromeda-en', label: 'Andromeda — friendly, upbeat' },
  { id: 'aura-2-arcas-en', label: 'Arcas — calm, measured' },
  { id: 'aura-2-aurora-en', label: 'Aurora — expressive, engaging' },
  { id: 'aura-2-luna-en', label: 'Luna — soft, approachable' },
  { id: 'aura-2-orion-en', label: 'Orion — authoritative' },
] as const;

export type TtsVoiceId = (typeof TTS_VOICES)[number]['id'];

export const TTS_SPEED_OPTIONS = [
  { value: 0.8, label: 'Slower (0.8×)' },
  { value: 0.9, label: 'Relaxed (0.9×)' },
  { value: 1.0, label: 'Normal (1.0×)' },
  { value: 1.1, label: 'Snappy (1.1×)' },
  { value: 1.2, label: 'Fast (1.2×)' },
] as const;

export type VoiceChatSendMode = 'pause' | 'keyword';

const STORAGE_KEYS = {
  voice: 'interview-gym-tts-voice',
  speed: 'interview-gym-tts-speed',
  sendMode: 'interview-gym-voice-chat-send-mode',
  keyword: 'interview-gym-voice-chat-keyword',
} as const;

export interface AudioPreferences {
  ttsVoice: TtsVoiceId;
  ttsSpeed: number;
  voiceChatSendMode: VoiceChatSendMode;
  voiceChatKeyword: string;
}

const DEFAULTS: AudioPreferences = {
  ttsVoice: 'aura-2-thalia-en',
  ttsSpeed: 1.0,
  voiceChatSendMode: 'pause',
  voiceChatKeyword: 'send message',
};

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getAudioPreferences(): AudioPreferences {
  const voice = readStorage(STORAGE_KEYS.voice);
  const speed = readStorage(STORAGE_KEYS.speed);
  const sendMode = readStorage(STORAGE_KEYS.sendMode);
  const keyword = readStorage(STORAGE_KEYS.keyword);

  const validVoice = TTS_VOICES.some((v) => v.id === voice);

  return {
    ttsVoice: validVoice ? (voice as TtsVoiceId) : DEFAULTS.ttsVoice,
    ttsSpeed: speed ? Number.parseFloat(speed) : DEFAULTS.ttsSpeed,
    voiceChatSendMode: sendMode === 'keyword' ? 'keyword' : 'pause',
    voiceChatKeyword: keyword?.trim() || DEFAULTS.voiceChatKeyword,
  };
}

export function saveAudioPreference<K extends keyof typeof STORAGE_KEYS>(
  key: K,
  value: string
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {
    /* ignore */
  }
}

export { STORAGE_KEYS as AUDIO_PREFERENCE_KEYS, DEFAULTS as DEFAULT_AUDIO_PREFERENCES };
