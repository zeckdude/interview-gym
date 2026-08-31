'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { HighlightedCodeBlock } from '@/components/code/HighlightedCodeBlock';
import { LearnInlineText } from '@/components/learn/LearnCodeBlock';
import { formatQuotedDisplayOutput } from '@/lib/learn/execute-code';
import {
  getLearnModuleTitle,
  getReferencesForCoveredModules,
  isLearnModuleAvailable,
  type LearnReferenceEntry,
} from '@/data/learn/reference';

function ReferenceCodeBlock({ code, result }: { code: string; result: string }) {
  const displayResult = formatQuotedDisplayOutput(code, result);
  return (
    <div className="space-y-4">
      <HighlightedCodeBlock code={code} compact showLineNumbers={false} showPrompt />
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-1.5">
          Result:
        </p>
        <pre className="font-mono text-success whitespace-pre-wrap text-base leading-relaxed">
          {displayResult}
        </pre>
      </div>
    </div>
  );
}

function ReferenceCard({ entry }: { entry: LearnReferenceEntry }) {
  const lessonAvailable = isLearnModuleAvailable(entry.moduleId);

  return (
    <article className="border-b border-border-subtle py-7 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
          {entry.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {lessonAvailable ? (
            <Link
              href={`/learn/${entry.moduleId}`}
              className="font-body text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
            >
              View lesson →
            </Link>
          ) : null}
          <a
            href={entry.mdnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
          >
            MDN →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 rounded-xl border border-border-subtle bg-bg-subtle overflow-hidden">
        <div className="p-5 xl:border-r border-border-subtle">
          <LearnInlineText content={entry.description} />
        </div>
        <div className="p-5 bg-code-bg">
          <ReferenceCodeBlock code={entry.code} result={entry.result} />
        </div>
      </div>
    </article>
  );
}

const toggleButtonClass = cn(
  'reference-panel-toggle flex items-center gap-2 rounded-lg border px-5 py-3 font-body text-sm font-semibold shadow-raised transition-colors'
);

function matchesSearch(entry: LearnReferenceEntry, query: string): boolean {
  const haystack = [
    entry.title,
    entry.description,
    entry.code,
    entry.result,
    getLearnModuleTitle(entry.moduleId) ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

interface LearnReferencePanelProps {
  coveredModuleIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDesktop: boolean;
  panelWidthPx: number;
  isDragging: boolean;
  onResizeStart: (clientX: number) => void;
}

export function LearnReferencePanel({
  coveredModuleIds,
  open,
  onOpenChange,
  isDesktop,
  panelWidthPx,
  isDragging,
  onResizeStart,
}: LearnReferencePanelProps) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string | 'all'>('all');

  const entries = useMemo(
    () => getReferencesForCoveredModules(coveredModuleIds),
    [coveredModuleIds]
  );

  const lessonOptions = useMemo(() => {
    const ids = Array.from(new Set(entries.map((e) => e.moduleId)));
    return ids.map((id) => ({
      id,
      title: getLearnModuleTitle(id) ?? id,
    }));
  }, [entries]);

  const lessonCount = lessonOptions.length;

  const filteredEntries = useMemo(() => {
    let list = entries;
    if (moduleFilter !== 'all') {
      list = list.filter((e) => e.moduleId === moduleFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((e) => matchesSearch(e, q));
    }
    return list;
  }, [entries, moduleFilter, search]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setModuleFilter('all');
    }
  }, [open]);

  const subtitle =
    entries.length === 0
      ? 'Complete a lesson step to unlock reference entries'
      : `${entries.length} concept${entries.length === 1 ? '' : 's'} from ${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className={cn(toggleButtonClass, 'fixed bottom-8 right-8 z-50')}
          aria-expanded={false}
          aria-label="Show reference"
        >
          <ReferenceIcon />
          Show Reference
        </button>
      )}

      {open && !isDesktop && (
        <button
          type="button"
          aria-label="Close reference panel"
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => onOpenChange(false)}
        />
      )}

      <aside
        style={{
          width: isDesktop ? panelWidthPx : '100vw',
          maxWidth: '100vw',
          transition: isDragging ? 'transform 300ms ease-out' : 'transform 300ms ease-out, width 150ms ease-out',
        }}
        className={cn(
          'fixed top-0 right-0 z-40 flex flex-col h-full',
          'bg-bg-surface border-l border-border-subtle shadow-modal',
          open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        )}
        aria-hidden={!open}
      >
        {isDesktop && open && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize reference panel"
            className={cn(
              'reference-panel-resize-handle absolute left-0 top-0 bottom-0 z-50 touch-none',
              isDragging && 'reference-panel-resize-handle-active'
            )}
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              onResizeStart(e.clientX);
            }}
          />
        )}

        <header className="shrink-0 px-8 pt-8 pb-4 border-b border-border-subtle">
          <h2 className="font-display font-bold text-2xl text-text-primary">
            Modern JavaScript Reference
          </h2>
          <p className="font-body text-base text-text-secondary mt-2">{subtitle}</p>
        </header>

        {entries.length > 0 && (
          <div className="shrink-0 px-8 py-4 border-b border-border-subtle bg-bg-surface space-y-4">
            <label className="block">
              <span className="sr-only">Search references</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or keyword…"
                className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </label>

            {lessonOptions.length > 1 && (
              <div className="space-y-2">
                <p className="font-body text-sm font-semibold text-text-primary">
                  Filter by lesson
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    active={moduleFilter === 'all'}
                    onClick={() => setModuleFilter('all')}
                  >
                    All lessons
                  </FilterChip>
                  {lessonOptions.map((lesson) => (
                    <FilterChip
                      key={lesson.id}
                      active={moduleFilter === lesson.id}
                      onClick={() => setModuleFilter(lesson.id)}
                    >
                      {lesson.title}
                    </FilterChip>
                  ))}
                </div>
              </div>
            )}

            {(search.trim() || moduleFilter !== 'all') && (
              <p className="font-body text-sm text-text-secondary">
                Showing {filteredEntries.length} of {entries.length} reference
                {entries.length === 1 ? '' : 's'}
                {search.trim() ? ` matching “${search.trim()}”` : ''}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {entries.length === 0 ? (
            <p className="font-body text-base text-text-secondary leading-relaxed">
              References appear here as you progress through modules. Finish a few steps and check
              back.
            </p>
          ) : filteredEntries.length === 0 ? (
            <div className="space-y-3">
              <p className="font-body text-base text-text-primary">
                No references match your search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setModuleFilter('all');
                }}
                className="font-body text-sm font-semibold text-brand hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <ReferenceCard key={entry.id} entry={entry} />
            ))
          )}
        </div>

        {open && (
          <div className="shrink-0 p-6 border-t border-border-subtle flex justify-end bg-bg-base">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={toggleButtonClass}
              aria-expanded
              aria-label="Hide reference"
            >
              <ReferenceIcon />
              Hide Reference
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-body text-sm font-semibold px-4 py-2 rounded-lg border transition-colors',
        active ? 'bg-brand text-white border-brand' : 'reference-panel-toggle'
      )}
    >
      {children}
    </button>
  );
}

function ReferenceIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect x="2" y="1" width="10" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 4h6M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Callout box for hints and reveal explanations. */
export function LearnCallout({
  title,
  children,
  variant = 'hint',
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'hint' | 'reveal' | 'success';
}) {
  return (
    <div
      className={cn(
        'rounded-xl border-l-4 p-5 space-y-2',
        variant === 'hint' && 'bg-brand/10 border-brand',
        variant === 'reveal' && 'bg-warning/10 border-warning',
        variant === 'success' && 'bg-success/10 border-success'
      )}
    >
      <p className="font-body text-sm font-bold uppercase tracking-wide text-text-primary">
        {title}
      </p>
      <div className="font-body text-lg text-text-primary leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export { useReferencePanelLayout } from '@/components/learn/useReferencePanelLayout';
