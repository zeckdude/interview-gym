'use client';

import { useState } from 'react';
import { PlaybookFormattedText } from '@/components/playbook/PlaybookFormattedText';
import { useRightPanel } from '@/components/providers/RightPanelProvider';
import type { PlaybookCtx } from '@/lib/playbook/playbook-context';
import {
  playbookEntrySessionKey,
  playbookSubsectionSessionKey,
} from '@/lib/playbook/playbook-context';
import { getCategoryById } from '@/lib/playbook/categories';

function AiEditIconButton({
  label,
  onClick,
  className = '',
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-brand hover:bg-brand-light border border-transparent hover:border-border-subtle transition-colors ${className}`}
    >
      <span aria-hidden className="text-base leading-none">
        ✏️
      </span>
    </button>
  );
}

interface Subsection {
  id: string;
  label: string;
  textContent: string | null;
  transcript: string | null;
}

interface Entry {
  id: string;
  category: string;
  title: string;
  summary: string | null;
  questionPrompt: string | null;
  isSeeded: boolean;
  subsections: Subsection[];
}

interface PlaybookEntryCardProps {
  entry: Entry;
  categoryLabel: string;
  suggestedQuestions?: string[];
  onRefresh: () => void;
}

export function PlaybookEntryCard({
  entry,
  categoryLabel,
  suggestedQuestions,
  onRefresh,
}: PlaybookEntryCardProps) {
  const { openPlaybookChat } = useRightPanel();
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const category = getCategoryById(entry.category);

  const buildCtx = (
    intent: PlaybookCtx['intent'],
    subsection?: Subsection
  ): PlaybookCtx => ({
    sessionKey:
      intent === 'edit-subsection' && subsection
        ? playbookSubsectionSessionKey(entry.id, subsection.id)
        : playbookEntrySessionKey(entry.id),
    intent,
    entryId: entry.id,
    entryTitle: entry.title,
    category: entry.category,
    categoryLabel,
    questionPrompt: entry.questionPrompt,
    currentSubsection: subsection?.label ?? null,
    currentSubsectionId: subsection?.id ?? null,
    subsections: entry.subsections.map((s) => ({
      id: s.id,
      label: s.label,
      textContent: s.textContent ?? s.transcript,
    })),
    isSeeded: entry.isSeeded,
    suggestedQuestions,
    onSaved: onRefresh,
  });

  const handleEditEntry = () => {
    openPlaybookChat(buildCtx('edit-entry'));
  };

  const handleEditSubsection = (sub: Subsection) => {
    openPlaybookChat(buildCtx('edit-subsection', sub));
  };

  return (
    <div className="bg-bg-surface rounded-xl shadow-card border border-border-subtle overflow-hidden">
      <div className="p-4 space-y-3 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0">{category?.icon ?? '📋'}</span>
            <h3 className="font-display font-bold text-lg text-text-primary truncate flex-1 min-w-0">
              {entry.title}
            </h3>
            <AiEditIconButton label="Edit entry with AI" onClick={handleEditEntry} />
          </div>
          {entry.summary && (
            <p className="font-body text-base text-text-primary italic">
              &ldquo;{entry.summary}&rdquo;
            </p>
          )}
          {entry.questionPrompt && (
            <p className="font-body text-sm text-text-primary bg-info-light border-l-4 border-info px-3 py-2 rounded-r-md">
              <span className="font-semibold">Interview question:</span> {entry.questionPrompt}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {entry.subsections.map((sub) => {
          const content = sub.textContent ?? sub.transcript;
          const isExpanded = expandedSub === sub.id;
          const isEmpty = !content;

          return (
            <div
              key={sub.id}
              className={`rounded-lg overflow-hidden border ${
                isEmpty ? 'border-warning bg-warning-light' : 'border-border-subtle bg-bg-surface'
              }`}
            >
              <div
                className={`flex items-center gap-2 px-3 py-2.5 ${
                  isEmpty ? 'bg-warning-light' : 'bg-bg-subtle'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedSub(isExpanded ? null : sub.id)}
                  className={`flex-1 flex items-center gap-2 min-w-0 text-left rounded-lg px-1 py-1 transition-colors ${
                    isEmpty ? 'hover:bg-warning-light/80' : 'hover:bg-bg-base'
                  }`}
                >
                  <span className="shrink-0 text-text-muted text-xs" aria-hidden>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <span className="font-body text-base font-semibold text-text-primary truncate">
                    {sub.label}
                  </span>
                  {isEmpty && (
                    <span className="shrink-0 font-body text-xs font-semibold text-warning px-2 py-0.5 rounded-full bg-bg-surface border border-warning/30">
                      Needs content
                    </span>
                  )}
                </button>
                <AiEditIconButton
                  label={`Edit ${sub.label} with AI`}
                  onClick={() => handleEditSubsection(sub)}
                />
              </div>

              {isExpanded && (
                <div
                  className={`p-4 border-t space-y-3 ${
                    isEmpty ? 'border-warning/30 bg-warning-light/40' : 'border-border-subtle bg-bg-surface'
                  }`}
                >
                  {content ? (
                    <PlaybookFormattedText
                      text={content}
                      className="font-body text-base text-text-primary"
                    />
                  ) : (
                    <p className="font-body text-sm text-text-primary">
                      No content yet — use the ✏️ button to add your answer with AI.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
