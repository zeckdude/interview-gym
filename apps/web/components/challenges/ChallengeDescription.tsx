'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import type { Element, Text, RootContent } from 'hast';

interface ChallengeDescriptionProps {
  description: string;
}

function extractText(node: Element | RootContent | null | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return (node as Text).value;
  if ('children' in node) {
    return (node.children as RootContent[]).map(extractText).join('');
  }
  return '';
}

const components: Components = {
  h2({ children }) {
    return (
      <div className="flex items-center gap-3 pb-4">
        <div className="w-1.5 h-8 bg-brand rounded-full flex-shrink-0" />
        <h2 className="font-display font-bold text-xl text-text-primary dark:text-[#F0EDE8] leading-tight">
          {children}
        </h2>
      </div>
    );
  },

  h3({ children }) {
    const label = String(children);
    const isWhy =
      label.toLowerCase().includes('matters') || label.toLowerCase().includes('why');

    return (
      <div
        className={`flex items-center gap-2 mt-8 mb-4 pb-2 border-b ${
          isWhy ? 'border-cat-fe' : 'border-cat-be'
        }`}
      >
        <h3
          className={`font-display font-semibold text-base ${
            isWhy ? 'text-cat-fe' : 'text-cat-be'
          }`}
        >
          {children}
        </h3>
      </div>
    );
  },

  // Blockquotes are used in description.md files for callout info boxes.
  // "expected" / "output" / "returns" → green (success)
  // everything else → brand orange
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

export function ChallengeDescription({ description }: ChallengeDescriptionProps) {
  return (
    <div>
      <ReactMarkdown components={components}>{description}</ReactMarkdown>
    </div>
  );
}
