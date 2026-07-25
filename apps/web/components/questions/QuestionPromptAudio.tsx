'use client';

import { ListenButton } from '@/components/audio/ListenButton';
import { readAlongHeadlineClass } from '@/components/audio/ReadAlongSentences';
import { useReadAlongPlayback } from '@/hooks/useReadAlongPlayback';

interface QuestionPromptAudioProps {
  questionText: string;
}

export function QuestionPromptAudio({ questionText }: QuestionPromptAudioProps) {
  const playback = useReadAlongPlayback({ headline: questionText, body: '' });

  return (
    <div className="space-y-3">
      <div className="group flex items-start gap-3">
        <h1
          className={readAlongHeadlineClass(
            playback.isHeadlineActive,
            'font-display font-bold text-2xl text-text-primary dark:text-[#F0EDE8] leading-snug flex-1'
          )}
        >
          {questionText}
        </h1>
        <ListenButton
          sourceText={playback.plan.fullPrepared}
          playback={playback}
          alwaysVisible
        />
      </div>
    </div>
  );
}
