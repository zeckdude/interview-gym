'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  label?: string;
  fillerWordCount?: number | null;
  wordsPerMinute?: number | null;
  durationSeconds?: number;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({
  audioUrl,
  label = 'Your answer',
  fillerWordCount,
  wordsPerMinute,
  durationSeconds,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setLoaded(false);
    setError(null);
    audio.load();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoaded = () => {
      const audioDuration = audio.duration;
      if (Number.isFinite(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
        setLoaded(true);
        setError(null);
      } else if (durationSeconds && durationSeconds > 0) {
        setDuration(durationSeconds);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onError = () => {
      setPlaying(false);
      setLoaded(false);
      setError('Could not play this recording. Try a new interview session.');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [durationSeconds, audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
      setError(null);
    } catch {
      setPlaying(false);
      setError('Playback blocked or audio unavailable.');
    }
  };

  const displayDuration =
    loaded && duration > 0 ? duration : durationSeconds && durationSeconds > 0 ? durationSeconds : duration;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 bg-bg-subtle rounded-md border border-border-subtle">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        <button
          type="button"
          onClick={togglePlay}
          disabled={Boolean(error)}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0 hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-body text-xs text-text-muted truncate">
            {label} — {formatDuration(displayDuration)}
            {!loaded && !error && displayDuration > 0 ? ' (estimated)' : ''}
          </p>
          <div className="h-1 bg-border-subtle rounded-full mt-1">
            <div
              className="h-1 bg-brand rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {(fillerWordCount != null || wordsPerMinute != null) && (
          <div className="text-right flex-shrink-0">
            {fillerWordCount != null && (
              <p className="font-body text-xs text-text-muted">{fillerWordCount} filler words</p>
            )}
            {wordsPerMinute != null && (
              <p className="font-body text-xs text-text-muted">{Math.round(wordsPerMinute)} wpm</p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="font-body text-sm text-error bg-error-light border border-error/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
