'use client';

import { cn } from '@/lib/utils';
import { readAlongActiveClass, readAlongInactiveClass } from '@/lib/read-along-styles';

interface ReadAlongSentencesProps {
  sentences: string[];
  activeIndex: number;
  className?: string;
  interactive?: boolean;
  onSentenceClick?: (index: number) => void;
}

export function ReadAlongSentences({
  sentences,
  activeIndex,
  className,
  interactive = false,
  onSentenceClick,
}: ReadAlongSentencesProps) {
  if (sentences.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {sentences.map((sentence, index) => (
        <p
          key={`${index}-${sentence.slice(0, 24)}`}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onClick={
            interactive
              ? () => {
                  onSentenceClick?.(index);
                }
              : undefined
          }
          onKeyDown={
            interactive
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSentenceClick?.(index);
                  }
                }
              : undefined
          }
          className={cn(
            'font-body text-base leading-relaxed rounded-md px-2 py-1',
            activeIndex === index ? readAlongActiveClass : readAlongInactiveClass,
            activeIndex === index ? '' : 'text-text-primary',
            interactive && 'cursor-pointer hover:bg-brand/5 transition-colors'
          )}
        >
          {sentence}
        </p>
      ))}
    </div>
  );
}

export function readAlongHeadlineClass(isActive: boolean, baseClass: string): string {
  return cn(
    baseClass,
    'rounded-md px-2 py-1',
    isActive ? readAlongActiveClass : readAlongInactiveClass
  );
}
