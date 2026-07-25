'use client';

import { useDeepgramTts } from '@/hooks/useDeepgramTts';
import { cn } from '@/lib/utils';

interface MessageListenButtonProps {
  text: string;
  className?: string;
  onBeforePlay?: () => void;
}

export function MessageListenButton({ text, className, onBeforePlay }: MessageListenButtonProps) {
  const { play, isPlaying, isLoading } = useDeepgramTts(text);

  if (!text.trim()) return null;

  const label = isPlaying ? 'Pause reply audio' : 'Listen to reply';

  return (
    <button
      type="button"
      onClick={() => {
        onBeforePlay?.();
        void play();
      }}
      aria-label={label}
      title={label}
      disabled={isLoading}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:text-brand hover:bg-brand/10 transition-colors',
        isPlaying && 'text-brand bg-brand/10',
        isLoading && 'opacity-60 cursor-wait',
        className
      )}
    >
      <span aria-hidden className="text-sm leading-none">
        {isPlaying ? '⏸' : isLoading ? '…' : '🔊'}
      </span>
    </button>
  );
}
