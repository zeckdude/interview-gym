'use client';

import { cn } from '@/lib/utils';
import {
  HIGHLIGHT_COLORS,
  HIGHLIGHT_COLORS_LIGHT,
  tokenizeJavaScript,
  type HighlightToken,
  type HighlightTokenType,
} from '@/lib/syntax-highlight';
import { useTheme } from '@/components/providers/ThemeProvider';

interface HighlightedCodeBlockProps {
  code: string;
  language?: 'javascript' | 'typescript';
  showLineNumbers?: boolean;
  /** Prefix each line with > (reference panel style). */
  showPrompt?: boolean;
  className?: string;
  /** Compact variant for reference cards */
  compact?: boolean;
}

function HighlightLine({
  tokens,
  colors,
}: {
  tokens: HighlightToken[];
  colors: Record<HighlightTokenType, string>;
}) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} style={{ color: colors[token.type] }}>
          {token.value}
        </span>
      ))}
    </>
  );
}

export function HighlightedCodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  showPrompt = false,
  className,
  compact = false,
}: HighlightedCodeBlockProps) {
  const { darkMode } = useTheme();
  const colors = darkMode === 'dark' ? HIGHLIGHT_COLORS : HIGHLIGHT_COLORS_LIGHT;
  const lines = tokenizeJavaScript(code);
  const lineCount = Math.max(lines.length, 1);

  return (
    <div
      className={cn(
        'rounded-xl border-2 border-border-strong bg-code-bg overflow-hidden',
        className
      )}
      data-language={language}
    >
      <pre
        className={cn(
          'font-mono leading-relaxed overflow-x-auto',
          compact ? 'p-4 text-sm' : 'p-5 text-[17px]'
        )}
      >
        {lines.map((tokens, lineIndex) => (
          <div key={lineIndex} className="flex gap-3 min-h-[1.5em]">
            {showLineNumbers && (
              <span
                className={cn(
                  'select-none text-text-secondary shrink-0 text-right tabular-nums opacity-80',
                  compact ? 'w-6 text-xs' : 'w-8 text-sm'
                )}
                aria-hidden
              >
                {lineIndex + 1}
              </span>
            )}
            <code className="flex-1 whitespace-pre">
              {showPrompt && (
                <span className="text-text-secondary select-none">&gt; </span>
              )}
              <HighlightLine tokens={tokens} colors={colors} />
            </code>
          </div>
        ))}
        {lines.length === 0 && (
          <div className="flex gap-3">
            {showLineNumbers && (
              <span className="select-none text-text-muted w-8 text-sm text-right">1</span>
            )}
            <code className="text-text-muted"> </code>
          </div>
        )}
      </pre>
      <span className="sr-only">{lineCount} lines of code</span>
    </div>
  );
}

/** Extract raw code string from react-markdown pre > code children. */
export function extractCodeFromMarkdownPre(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(extractCodeFromMarkdownPre).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    const props = (children as { props?: { children?: React.ReactNode } }).props;
    return extractCodeFromMarkdownPre(props?.children ?? '');
  }
  return '';
}
