'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { HighlightedCodeBlock } from '@/components/code/HighlightedCodeBlock';

interface LearnCodeBlockProps {
  code: string;
  editable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  highlightLine?: number;
  className?: string;
  /** Rendered inside the editor card at the bottom-right (Run, Hint, etc.). */
  actions?: ReactNode;
}

function syncTextareaHeight(el: HTMLTextAreaElement) {
  el.style.height = '0px';
  el.style.height = `${el.scrollHeight}px`;
}

function focusTextareaAtEnd(el: HTMLTextAreaElement) {
  el.focus();
  el.selectionStart = el.selectionEnd = el.value.length;
}

function handleEditorShellClick(
  e: React.MouseEvent<HTMLDivElement>,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  const target = e.target as HTMLElement;
  if (target.closest('textarea, button, a, input, label')) return;
  if (textareaRef.current) focusTextareaAtEnd(textareaRef.current);
}

interface LearnGrowTextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  className?: string;
  actions?: ReactNode;
  /** Rendered at the top inside the card (e.g. output vs error mode toggle). */
  header?: ReactNode;
  'aria-label'?: string;
  disabled?: boolean;
  /** Visual state when the field is disabled but actions stay active. */
  mutedShell?: boolean;
}

export const LearnGrowTextarea = forwardRef<HTMLTextAreaElement, LearnGrowTextareaProps>(
  function LearnGrowTextarea(
    { id, value, onChange, onKeyDown, placeholder, className, actions, header, 'aria-label': ariaLabel, disabled = false, mutedShell = false },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    useLayoutEffect(() => {
      if (textareaRef.current) syncTextareaHeight(textareaRef.current);
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        syncTextareaHeight(e.target);
      },
      [onChange]
    );

    return (
      <div
        className={cn(
          'rounded-xl border-2 border-border-subtle bg-bg-surface transition-[border-color,box-shadow]',
          !disabled && 'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
          mutedShell && 'border-cat-fe/40 bg-cat-fe/5 ring-2 ring-cat-fe/15',
          className
        )}
        onClick={(e) => {
          if (disabled) return;
          handleEditorShellClick(e, textareaRef);
        }}
      >
        {header && <div className="px-4 pt-3">{header}</div>}
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          rows={1}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'block w-full px-4 pt-3 pb-2 font-mono text-lg leading-relaxed bg-transparent resize-none overflow-hidden min-h-[2.75rem] focus:outline-none',
            disabled
              ? 'cursor-not-allowed text-text-muted placeholder:text-text-muted'
              : 'text-text-primary'
          )}
        />
        {actions && (
          <div className="flex flex-wrap justify-end gap-2 px-3 pb-3 pt-1">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

export const LearnCodeBlock = forwardRef<HTMLTextAreaElement, LearnCodeBlockProps>(
  function LearnCodeBlock(
    { code, editable = false, value, onChange, onKeyDown, className, actions },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    useLayoutEffect(() => {
      if (editable && textareaRef.current) {
        syncTextareaHeight(textareaRef.current);
      }
    }, [editable, value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e.target.value);
        syncTextareaHeight(e.target);
      },
      [onChange]
    );

    if (editable) {
      return (
        <div
          className={cn(
            'rounded-xl border-2 border-border-strong bg-code-bg transition-[border-color,box-shadow]',
            'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
            className
          )}
          onClick={(e) => handleEditorShellClick(e, textareaRef)}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            spellCheck={false}
            rows={1}
            className="block w-full px-5 pt-4 pb-2 font-mono text-[17px] leading-relaxed text-text-primary bg-transparent resize-none overflow-hidden min-h-[2.75rem] focus:outline-none"
            aria-label="Code editor"
          />
          {actions && (
            <div className="flex flex-wrap justify-end gap-2 px-4 pb-4 pt-1">
              {actions}
            </div>
          )}
        </div>
      );
    }

    return (
      <HighlightedCodeBlock
        code={code}
        className={className}
        showLineNumbers
      />
    );
  }
);

type ResultPanelMode = 'full' | 'output-only' | 'feedback-only';

interface ResultPanelProps {
  goal?: string;
  yours?: string;
  passed?: boolean | null;
  mode?: ResultPanelMode;
  isError?: boolean;
  goalLabel?: string;
  /** Neutral informational styling for goals the user is working toward (not a failure state). */
  goalVariant?: 'default' | 'expected';
  /** Optional note beside the Yours label, e.g. when the answer was revealed. */
  yoursNote?: string;
}

export function ResultPanel({
  goal,
  yours,
  passed,
  mode = 'full',
  isError = false,
  goalLabel,
  goalVariant = 'default',
  yoursNote,
}: ResultPanelProps) {
  const showGoal = mode === 'full' || mode === 'output-only';
  const showYours = mode === 'full' || mode === 'feedback-only';
  const errorTone = isError && passed !== true;
  const expectedTone = goalVariant === 'expected' && !errorTone && passed !== true;
  const resolvedGoalLabel =
    goalLabel ??
    (mode === 'output-only'
      ? isError
        ? 'Result'
        : 'Output'
      : isError
        ? 'Expected error'
        : 'Goal');

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-5 space-y-4',
        passed === true && 'border-success/40 bg-success/5',
        errorTone && 'border-error/40 bg-error/5',
        expectedTone && 'border-cat-fe/40 bg-cat-fe/10',
        passed !== true && !errorTone && !expectedTone && 'border-border-strong bg-bg-subtle'
      )}
    >
      {showGoal && goal !== undefined && (
        <div>
          <p
            className={cn(
              'font-body text-xs font-bold uppercase tracking-wide mb-1.5',
              passed === true && 'text-success',
              errorTone && 'text-error',
              expectedTone && 'text-cat-fe',
              passed !== true && !errorTone && !expectedTone && 'text-text-secondary'
            )}
          >
            {resolvedGoalLabel}
          </p>
          <p
            className={cn(
              'font-mono text-[17px] leading-relaxed whitespace-pre-wrap inline-flex items-center gap-2',
              passed === true && 'text-success',
              errorTone && 'text-error',
              passed !== true && !errorTone && 'text-text-primary'
            )}
          >
            <span>{goal}</span>
            {passed === true && <span aria-hidden>✓</span>}
          </p>
        </div>
      )}
      {showYours && yours !== undefined && (
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary mb-1.5">
            Yours
            {yoursNote && (
              <span className="font-normal normal-case text-text-muted ml-1.5">
                · {yoursNote}
              </span>
            )}
          </p>
          <p
            className={cn(
              'font-mono text-[17px] leading-relaxed whitespace-pre-wrap inline-flex items-center gap-2',
              passed === true && 'text-success',
              passed === false && 'text-error',
              passed == null && 'text-text-primary'
            )}
          >
            <span>{yours !== '' ? yours : passed != null ? '—' : ''}</span>
            {passed === true && <span aria-hidden>✓</span>}
            {passed === false && <span aria-hidden>✗</span>}
          </p>
        </div>
      )}
    </div>
  );
}

const INLINE_TOKEN = /(`[^`]+`|\*\*[^*]+?\*\*)/g;

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = INLINE_TOKEN.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith('`')) {
      nodes.push(
        <code
          key={match.index}
          className="font-mono text-base bg-code-bg text-text-primary border-2 border-border-strong px-1.5 py-0.5 rounded mx-0.5"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <strong key={match.index} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes;
}

/** Render inline `code` and **bold** in plain text, with paragraph breaks. */
export function LearnInlineText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className={cn('space-y-4', className)}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="font-body text-lg text-text-primary leading-relaxed whitespace-pre-wrap"
        >
          {parseInline(para.replace(/\n/g, ' '))}
        </p>
      ))}
    </div>
  );
}

/** Short teaching note before a code example — left accent only, no boxed container. */
export function LearnConceptNote({ content }: { content: string }) {
  return (
    <div className="my-[50px] border-l-4 border-cat-fe pl-7 py-5 pr-2">
      <LearnInlineText content={content} className="space-y-3" />
    </div>
  );
}
