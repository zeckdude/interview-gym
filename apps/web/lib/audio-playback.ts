type StopListener = () => void;

let activeAudio: HTMLAudioElement | null = null;
let activeGain: GainNode | null = null;
let activeContext: AudioContext | null = null;
let activeSource: MediaElementAudioSourceNode | null = null;
let activeStopListener: StopListener | null = null;
let activeObjectUrl: string | null = null;
let fadeFrame: number | null = null;

const FADE_MS = 120;

function cancelFade() {
  if (fadeFrame !== null) {
    cancelAnimationFrame(fadeFrame);
    fadeFrame = null;
  }
}

function cleanupAudioNodes() {
  cancelFade();
  try {
    activeSource?.disconnect();
  } catch {
    /* ignore */
  }
  try {
    activeGain?.disconnect();
  } catch {
    /* ignore */
  }
  activeSource = null;
  activeGain = null;
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio = null;
  }
  if (activeContext) {
    void activeContext.close();
    activeContext = null;
  }
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

export interface StopPlaybackOptions {
  /** When true, cut audio instantly (user pressed Stop). Default fades out for handoffs. */
  immediate?: boolean;
}

export function stopGlobalAudioPlayback(options?: StopPlaybackOptions): Promise<void> {
  const audio = activeAudio;
  const gain = activeGain;
  const context = activeContext;
  const stopListener = activeStopListener;

  if (!audio || !gain || !context || options?.immediate) {
    cleanupAudioNodes();
    stopListener?.();
    activeStopListener = null;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startGain = gain.gain.value;
    const start = context.currentTime;

    const fade = () => {
      const elapsedMs = (context.currentTime - start) * 1000;
      const progress = Math.min(elapsedMs / FADE_MS, 1);
      gain.gain.value = startGain * (1 - progress);

      if (progress < 1) {
        fadeFrame = requestAnimationFrame(fade);
        return;
      }

      cleanupAudioNodes();
      stopListener?.();
      activeStopListener = null;
      resolve();
    };

    fadeFrame = requestAnimationFrame(fade);
  });
}

export async function playAudioBlob(blob: Blob, onEnded?: () => void): Promise<void> {
  await stopGlobalAudioPlayback();

  const url = URL.createObjectURL(blob);
  activeObjectUrl = url;
  const audio = new Audio(url);
  activeAudio = audio;

  const context = new AudioContext();
  activeContext = context;
  const source = context.createMediaElementSource(audio);
  activeSource = source;
  const gain = context.createGain();
  activeGain = gain;
  gain.gain.value = 1;
  source.connect(gain);
  gain.connect(context.destination);

  return new Promise((resolve) => {
    const finish = () => {
      onEnded?.();
      resolve();
    };

    activeStopListener = finish;

    audio.onended = () => {
      void stopGlobalAudioPlayback();
    };

    audio.onerror = () => {
      void stopGlobalAudioPlayback().then(resolve);
    };

    void audio.play().catch(() => {
      void stopGlobalAudioPlayback().then(resolve);
    });
  });
}

export function isAudioPlaying(): boolean {
  return Boolean(activeAudio && !activeAudio.paused && !activeAudio.ended);
}
