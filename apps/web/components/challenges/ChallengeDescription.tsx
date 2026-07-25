'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import type { Element, Text, RootContent } from 'hast';
import { ListenButton } from '@/components/audio/ListenButton';
import {
  ReadAlongSentences,
  readAlongHeadlineClass,
} from '@/components/audio/ReadAlongSentences';
import { useListenButtonsPreference } from '@/hooks/useListenButtonsPreference';
import { useReadAlongPlayback } from '@/hooks/useReadAlongPlayback';
import {
  isCodeOnlyMarkdown,
  splitMarkdownIntoSections,
  type MarkdownSection,
} from '@/lib/markdown-to-speech';
import { cn } from '@/lib/utils';

interface ChallengeDescriptionProps {
  description: string;
  /** When false, hides all listen controls (e.g. nested inside a code-example step). */
  enableListen?: boolean;
}

function extractText(node: Element | RootContent | null | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return (node as Text).value;
  if ('children' in node) {
    return (node.children as RootContent[]).map(extractText).join('');
  }
  return '';
}

const bodyComponents: Components = {
  blockquote({ children, node }) {
    const rawText = extractText(node).toLowerCase();
    const isSuccess =
      rawText.includes('expected') ||
      rawText.includes('output') ||
      rawText.includes('returns');

    const style = isSuccess
      ? 'bg-success-light border-l-4 border-success dark:bg-success/15 dark:border-success'
      : 'bg-brand-light border-l-4 border-brand dark:bg-brand/15 dark:border-brand';

    return (
      <div className={`${style} rounded-r-lg px-5 py-4 my-4`}>
        <div className="font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed [&_p]:m-0 [&_code]:bg-white/70 dark:[&_code]:bg-black/30">
          {children}
        </div>
      </div>
    );
  },

  p({ children }) {
    return (
      <p className="font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed mb-4">
        {children}
      </p>
    );
  },

  strong({ children }) {
    return (
      <strong className="font-semibold text-text-primary dark:text-[#F0EDE8]">{children}</strong>
    );
  },

  code({ children, className }) {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={`${className ?? ''} font-mono text-sm`}>
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-sm bg-bg-subtle dark:bg-[#252525] text-brand-dark dark:text-brand px-1.5 py-0.5 rounded-sm border border-border-subtle dark:border-[#3A3A3A]">
        {children}
      </code>
    );
  },

  pre({ children }) {
    return (
      <pre className="bg-bg-inverse dark:bg-black text-text-inverse font-mono text-sm rounded-lg p-4 overflow-x-auto my-3">
        {children}
      </pre>
    );
  },

  ul({ children }) {
    return <ul className="space-y-3 my-4 ml-1">{children}</ul>;
  },

  ol({ children }) {
    return <ol className="space-y-3 my-4 ml-1">{children}</ol>;
  },

  li({ children }) {
    return (
      <li className="flex items-start gap-3 font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed">
        <span className="mt-2.5 w-2 h-2 rounded-full bg-brand flex-shrink-0" />
        <span className="flex-1">{children}</span>
      </li>
    );
  },
};

function SectionBody({
  section,
  playback,
  showBodyReadAlong,
}: {
  section: MarkdownSection;
  playback: ReturnType<typeof useReadAlongPlayback>;
  showBodyReadAlong: boolean;
}) {
  if (showBodyReadAlong && playback.bodySentences.length > 0) {
    return (
      <ReadAlongSentences
        sentences={playback.bodySentences}
        activeIndex={playback.activeBodyIndex}
        interactive={showBodyReadAlong}
        onSentenceClick={(index) => void playback.seekToBodyIndex(index)}
      />
    );
  }

  if (!section.markdown) return null;
  return <ReactMarkdown components={bodyComponents}>{section.markdown}</ReactMarkdown>;
}

function SectionBlock({
  section,
  enableListen,
}: {
  section: MarkdownSection;
  enableListen: boolean;
}) {
  const playback = useReadAlongPlayback({
    headline: section.heading,
    body: section.markdown,
  });
  const { highlightWhileReading } = useListenButtonsPreference();
  const showBodyReadAlong =
    playback.isPlaying && highlightWhileReading && playback.bodySentences.length > 0;
  const canListen = enableListen && !isCodeOnlyMarkdown(section.markdown);

  if (!section.heading) {
    return (
      <section className="group space-y-4">
        {canListen && (
          <div className="flex justify-end">
            <ListenButton sourceText={playback.plan.fullPrepared} playback={playback} />
          </div>
        )}
        <SectionBody
          section={section}
          playback={playback}
          showBodyReadAlong={showBodyReadAlong}
        />
      </section>
    );
  }

  if (section.level === 2) {
    return (
      <section className="group space-y-4">
        <div className="flex items-center gap-3 pb-4">
          <div className="w-1.5 h-8 bg-brand rounded-full flex-shrink-0" />
          <h2
            className={readAlongHeadlineClass(
              playback.isHeadlineActive,
              'font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8] leading-tight flex-1'
            )}
          >
            {section.heading}
          </h2>
          {canListen && (
            <ListenButton sourceText={playback.plan.fullPrepared} playback={playback} />
          )}
        </div>
        <SectionBody
          section={section}
          playback={playback}
          showBodyReadAlong={showBodyReadAlong}
        />
      </section>
    );
  }

  const isWhy =
    section.heading.toLowerCase().includes('matters') ||
    section.heading.toLowerCase().includes('why');

  return (
    <section className="group space-y-4">
      <div
        className={cn(
          'flex items-center gap-2 mt-8 mb-4 pb-2 border-b',
          isWhy ? 'border-cat-fe' : 'border-cat-be'
        )}
      >
        <h3
          className={readAlongHeadlineClass(
            playback.isHeadlineActive,
            cn(
              'font-display font-semibold text-base flex-1',
              !playback.isHeadlineActive && (isWhy ? 'text-cat-fe' : 'text-cat-be')
            )
          )}
        >
          {section.heading}
        </h3>
        {canListen && (
          <ListenButton sourceText={playback.plan.fullPrepared} playback={playback} />
        )}
      </div>
      <SectionBody
        section={section}
        playback={playback}
        showBodyReadAlong={showBodyReadAlong}
      />
    </section>
  );
}

export function ChallengeDescription({
  description,
  enableListen = true,
}: ChallengeDescriptionProps) {
  const sections = splitMarkdownIntoSections(description);

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <SectionBlock
          key={`${section.heading ?? 'intro'}-${index}`}
          section={section}
          enableListen={enableListen}
        />
      ))}
    </div>
  );
}
