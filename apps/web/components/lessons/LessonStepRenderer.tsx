'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ReadOnlyCodeEditor } from '@/components/editor/ReadOnlyCodeEditor';
import { ChallengeDescription } from '@/components/challenges/ChallengeDescription';
import { ListenButton } from '@/components/audio/ListenButton';
import { ReadAlongSentences, readAlongHeadlineClass } from '@/components/audio/ReadAlongSentences';
import { useListenButtonsPreference } from '@/hooks/useListenButtonsPreference';
import { useReadAlongPlayback } from '@/hooks/useReadAlongPlayback';
import type { LessonStep } from '@/data/lessons';

const gotchaComponents: Components = {
  p({ children }) {
    return (
      <p className="font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed mb-3 last:mb-0">
        {children}
      </p>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold">{children}</strong>;
  },
  code({ children }) {
    return (
      <code className="font-mono text-sm bg-white/70 dark:bg-black/30 px-1.5 py-0.5 rounded-sm">
        {children}
      </code>
    );
  },
};

interface LessonStepRendererProps {
  step: LessonStep;
  stepNumber: number;
}

function ExplanationStep({
  step,
  stepNumber,
}: {
  step: LessonStep;
  stepNumber: number;
}) {
  const playback = useReadAlongPlayback({
    headline: step.title,
    body: step.content.trim(),
  });
  const { highlightWhileReading } = useListenButtonsPreference();
  const showBodyReadAlong =
    playback.isPlaying && highlightWhileReading && playback.bodySentences.length > 0;

  return (
    <section className="group space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white font-display font-bold text-sm flex items-center justify-center">
          {stepNumber}
        </span>
        {step.title && (
          <h2
            className={readAlongHeadlineClass(
              playback.isHeadlineActive,
              'font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8] flex-1'
            )}
          >
            {step.title}
          </h2>
        )}
        <ListenButton sourceText={playback.plan.fullPrepared} playback={playback} />
      </div>
      <div className="pl-11">
        {showBodyReadAlong ? (
          <ReadAlongSentences
            sentences={playback.bodySentences}
            activeIndex={playback.activeBodyIndex}
            interactive={showBodyReadAlong}
            onSentenceClick={(index) => void playback.seekToBodyIndex(index)}
          />
        ) : (
          <ChallengeDescription description={step.content.trim()} />
        )}
      </div>
    </section>
  );
}

function GotchaStep({ step }: { step: LessonStep }) {
  const playback = useReadAlongPlayback({
    headline: step.title,
    body: step.content.trim(),
  });
  const { highlightWhileReading } = useListenButtonsPreference();
  const showBodyReadAlong =
    playback.isPlaying && highlightWhileReading && playback.bodySentences.length > 0;

  return (
    <section
      className="group rounded-xl border-l-4 border-warning bg-warning-light dark:bg-warning/15 p-6 space-y-3"
      role="note"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden>
          ⚠️
        </span>
        <div className="space-y-3 flex-1">
          <div className="flex items-start gap-2">
            {step.title && (
              <h2
                className={readAlongHeadlineClass(
                  playback.isHeadlineActive,
                  'font-display font-bold text-lg text-text-primary dark:text-[#F0EDE8] flex-1'
                )}
              >
                {step.title}
              </h2>
            )}
            <ListenButton
              sourceText={playback.plan.fullPrepared}
              playback={playback}
              alwaysVisible
            />
          </div>
          {showBodyReadAlong ? (
            <ReadAlongSentences
              sentences={playback.bodySentences}
              activeIndex={playback.activeBodyIndex}
            />
          ) : (
            <ReactMarkdown components={gotchaComponents}>{step.content.trim()}</ReactMarkdown>
          )}
        </div>
      </div>
    </section>
  );
}

export function LessonStepRenderer({ step, stepNumber }: LessonStepRendererProps) {
  if (step.type === 'explanation') {
    return <ExplanationStep step={step} stepNumber={stepNumber} />;
  }

  if (step.type === 'code-example') {
    return (
      <section className="space-y-4" aria-label="Code example — read only, no audio">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cat-be text-white font-display font-bold text-sm flex items-center justify-center">
            {'</>'}
          </span>
          {step.title && (
            <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8]">
              {step.title}
            </h2>
          )}
        </div>
        <div className="pl-11 space-y-2">
          <p className="font-body text-sm text-text-muted">Read-only example</p>
          <ReadOnlyCodeEditor
            language={step.language ?? 'javascript'}
            value={step.content}
          />
        </div>
      </section>
    );
  }

  if (step.type === 'gotcha') {
    return <GotchaStep step={step} />;
  }

  return null;
}
