const NARRATION_CACHE_PREFIX = 'interview-gym-narration-';

export function getCachedNarration(challengeId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(`${NARRATION_CACHE_PREFIX}${challengeId}`);
  } catch {
    return null;
  }
}

export function cacheNarration(challengeId: string, script: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${NARRATION_CACHE_PREFIX}${challengeId}`, script);
  } catch {
    // ignore quota errors
  }
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakNarration(text: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopNarration(): void {
  if (isSpeechSynthesisAvailable()) {
    window.speechSynthesis.cancel();
  }
}

export function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
