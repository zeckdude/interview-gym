'use client';

import { useListenButtonsPreference } from '@/hooks/useListenButtonsPreference';
import type { useReadAlongPlayback } from '@/hooks/useReadAlongPlayback';
import { cn } from '@/lib/utils';

interface ListenButtonProps {
  sourceText: string;
  playback?: ReturnType<typeof useReadAlongPlayback>;
  className?: string;
  alwaysVisible?: boolean;
}

export function ListenButton({
  sourceText,
  playback,
  className,
  alwaysVisible = false,
}: ListenButtonProps) {
  const { loaded, showListenButtons } = useListenButtonsPreference();

  if (!loaded || !showListenButtons || !sourceText.trim() || !playback) {
    return null;
  }

  const { isPlaying, isLoading, play } = playback;

  const label = isPlaying
    ? 'Pause audio'
    : isLoading
      ? 'Loading audio'
      : 'Listen to this section';

  return (
    <button
      type="button"
      onClick={() => void play()}
      aria-label={label}
      title={label}
      disabled={isLoading}
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-text-muted transition-all',
        'hover:border-brand/30 hover:bg-brand/10 hover:text-brand',
        'focus-visible:border-brand/40 focus-visible:bg-brand/10 focus-visible:text-brand focus-visible:outline-none',
        isPlaying && 'border-brand/40 bg-brand/10 text-brand animate-pulse',
        isLoading && 'opacity-60 cursor-wait',
        !alwaysVisible &&
          'max-md:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100',
        className
      )}
    >
      <span aria-hidden className="text-base leading-none">
        {isPlaying ? '⏸' : isLoading ? '…' : '🔊'}
      </span>
    </button>
  );
}

/** @deprecated Use sourceText */
export type ListenButtonLegacyProps = ListenButtonProps & { text?: string };
