export function speakQuestion(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.name.includes('Google') || v.name.includes('Samantha')
  );
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
