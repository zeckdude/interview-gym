'use client';

import { cn } from '@/lib/utils';

interface VoiceLevelBarsProps {
  level: number;
  active?: boolean;
  className?: string;
}

const BAR_HEIGHTS = [0.35, 0.55, 0.85, 0.65, 0.45];

export function VoiceLevelBars({ level, active = true, className }: VoiceLevelBarsProps) {
  const clamped = Math.max(0, Math.min(1, level));

  return (
    <div
      className={cn('flex items-end justify-center gap-0.5 h-4', className)}
      aria-hidden
    >
      {BAR_HEIGHTS.map((base, index) => {
        const scale = active ? 0.25 + clamped * base * 1.4 : 0.2;
        return (
          <span
            key={index}
            className={cn(
              'w-0.5 rounded-full transition-all duration-75',
              active ? 'bg-brand' : 'bg-text-muted/40'
            )}
            style={{ height: `${Math.round(scale * 16)}px` }}
          />
        );
      })}
    </div>
  );
}
