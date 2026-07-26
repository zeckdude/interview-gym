'use client';

export type PlaybookIntent = 'add-entry' | 'edit-entry' | 'edit-subsection';

export interface PlaybookSubsectionCtx {
  id: string;
  label: string;
  textContent: string | null;
}

export interface PlaybookDraftTarget {
  type: 'subsection' | 'new-entry' | 'entry-title' | 'entry-question';
  subsectionId?: string;
  subsectionLabel?: string;
  title?: string;
  questionPrompt?: string;
  content: string;
}

export interface PlaybookCtx {
  /** Chat session id — scopes history to entry, subsection, or new-{category} */
  sessionKey: string;
  intent: PlaybookIntent;
  entryId: string | null;
  entryTitle: string;
  category: string;
  categoryLabel: string;
  questionPrompt: string | null;
  currentSubsection: string | null;
  currentSubsectionId: string | null;
  subsections: PlaybookSubsectionCtx[];
  isSeeded?: boolean;
  suggestedQuestions?: string[];
  onSaved?: () => void;
}

/** Whole-entry AI coach session (Edit with AI on the card). */
export function playbookEntrySessionKey(entryId: string): string {
  return entryId;
}

/** Single-subsection AI coach session (Edit Section with AI). */
export function playbookSubsectionSessionKey(entryId: string, subsectionId: string): string {
  return `${entryId}::sub::${subsectionId}`;
}
