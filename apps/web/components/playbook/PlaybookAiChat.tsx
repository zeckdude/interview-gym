'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { VoiceInterviewRecorder } from '@/components/voice-interviews/VoiceInterviewRecorder';
import { PlaybookFormattedText } from '@/components/playbook/PlaybookFormattedText';
import { useRightPanel, type PlaybookCtx } from '@/components/providers/RightPanelProvider';
import { normalizePlaybookMarkdown } from '@/lib/playbook/format-content';
import type { PlaybookDraftTarget } from '@/lib/playbook/playbook-context';
import {
  parseAllDraftBlocks,
  stripDraftBlocks,
} from '@/lib/playbook/draft-parser';

type DraftProposalStatus = 'pending' | 'saved' | 'dismissed';

interface DraftSection {
  label: string;
  content: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  localOnly?: boolean;
  draftProposal?: {
    sections: DraftSection[];
    status: DraftProposalStatus;
  };
}

let msgCounter = 0;
const newId = () => `pb-${++msgCounter}`;

function getOpeningMessage(ctx: PlaybookCtx): string {
  if (ctx.intent === 'add-entry') {
    return `Let's add a new **${ctx.categoryLabel}** entry. Pick a suggested question below, or tell me your story in your own words — I'll help you shape it into something interview-ready.\n\nNothing saves until you review the draft and click **Submit to Save**.`;
  }
  if (ctx.intent === 'edit-subsection' && ctx.currentSubsection) {
    return `You're working on **${ctx.currentSubsection}** in "${ctx.entryTitle}". The other sections are shown for context — I'll only propose changes to **${ctx.currentSubsection}** unless you ask otherwise.\n\nTell me what you want to say, or ask me to rewrite what's there. I'll put a draft in the review box — nothing saves until you click **Submit to Save**.`;
  }
  const subsectionList = ctx.subsections.map((s) => s.label).join(', ');
  return `You're editing **"${ctx.entryTitle}"**. Here's what you can do:\n\n- **Fill all sections at once** — ask me to complete the entry and I'll draft every empty section\n- **Rewrite any section:** ${subsectionList}\n- **Add metrics or boldness** to make impact clearer\n- **Change the title or interview question**\n- **Free chat** — tell me anything you want to improve\n\nI'll propose changes in the review box (one block per section). Nothing saves until you click **Submit to Save**.`;
}

function draftLabel(draft: PlaybookDraftTarget): string {
  if (draft.type === 'entry-title') return 'Title';
  if (draft.type === 'entry-question') return 'Interview question';
  if (draft.type === 'new-entry') return draft.subsectionLabel ?? 'New entry';
  return draft.subsectionLabel ?? 'Section';
}

function toDraftSections(
  draftTargets: PlaybookDraftTarget[],
  texts: string[]
): DraftSection[] {
  return draftTargets.map((draft, index) => ({
    label: draftLabel(draft),
    content: texts[index] ?? draft.content,
  }));
}

const STATUS_NOTE_RE = /^\[playbook-status:(saved|dismissed)\]/;

async function persistDraftStatusNote(
  sessionKey: string,
  status: 'saved' | 'dismissed',
  detail?: string
) {
  await fetch('/api/ai/playbook-chat/note', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionKey,
      content: `[playbook-status:${status}]${detail ? ` ${detail}` : ''}`,
    }),
  });
}

function resolveDraftStatusFromNotes(
  messages: { role: string; content: string }[],
  startIndex: number
): DraftProposalStatus {
  for (let i = startIndex + 1; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === 'user') break;

    const match = msg.content.match(/^\[playbook-status:(saved|dismissed)\]/);
    if (match) return match[1] as DraftProposalStatus;

    if (parseAllDraftBlocks(msg.content).length > 0) break;
  }

  return 'pending';
}

function buildHistoryMessages(
  rawMessages: { role: string; content: string }[]
): Message[] {
  const result: Message[] = [];

  for (let i = 0; i < rawMessages.length; i++) {
    const raw = rawMessages[i];

    if (raw.role === 'user') {
      result.push({ id: newId(), role: 'user', content: raw.content });
      continue;
    }

    if (STATUS_NOTE_RE.test(raw.content)) continue;

    const drafts = parseAllDraftBlocks(raw.content);
    const displayContent = stripDraftBlocks(raw.content);

    if (displayContent) {
      result.push({ id: newId(), role: 'assistant', content: displayContent });
    }

    if (drafts.length > 0) {
      result.push({
        id: newId(),
        role: 'assistant',
        content: '',
        draftProposal: {
          sections: drafts.map((draft) => ({
            label: draftLabel(draft),
            content: normalizePlaybookMarkdown(draft.content),
          })),
          status: resolveDraftStatusFromNotes(rawMessages, i),
        },
      });
    }
  }

  return result;
}

function markPendingDraftsDismissed(messages: Message[]): Message[] {
  return messages.map((msg) =>
    msg.draftProposal?.status === 'pending'
      ? {
          ...msg,
          draftProposal: { ...msg.draftProposal, status: 'dismissed' as const },
        }
      : msg
  );
}

function draftStatusLabel(status: DraftProposalStatus): string {
  if (status === 'saved') return 'Saved to playbook';
  if (status === 'dismissed') return 'Dismissed — not saved';
  return 'Pending review';
}

function DraftProposalBubble({
  sections,
  status,
}: {
  sections: DraftSection[];
  status: DraftProposalStatus;
}) {
  const isPending = status === 'pending';
  const isSaved = status === 'saved';
  const isDismissed = status === 'dismissed';

  return (
    <div
      className={`max-w-[90%] rounded-2xl rounded-bl-sm border-2 border-dashed px-4 py-3 space-y-3 ${
        isPending
          ? 'bg-bg-subtle/80 border-border-strong opacity-90'
          : isSaved
            ? 'bg-success-light border-success opacity-90'
            : 'bg-bg-subtle/50 border-border-subtle opacity-60'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-body text-xs font-semibold uppercase tracking-wide ${
            isDismissed
              ? 'text-text-muted line-through'
              : isSaved
                ? 'text-success'
                : 'text-text-muted'
          }`}
        >
          📝 Proposed draft
        </p>
        <span
          className={`font-body text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPending
              ? 'bg-bg-surface text-text-primary border border-border-subtle'
              :             isSaved
                ? 'bg-success-light text-success border border-success/30'
                : 'bg-bg-surface text-text-muted border border-border-subtle'
          }`}
        >
          {draftStatusLabel(status)}
        </span>
      </div>

      <div className={`space-y-3 ${isDismissed ? 'line-through decoration-text-muted/50' : ''}`}>
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="font-body text-xs font-semibold text-text-primary">{section.label}</p>
            <PlaybookFormattedText
              text={section.content}
              className="font-body text-sm text-text-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function applyDraftResponse(
  data: { draft?: PlaybookDraftTarget | null; drafts?: PlaybookDraftTarget[] },
  setDrafts: (drafts: PlaybookDraftTarget[]) => void,
  setDraftTexts: (texts: string[]) => void
): PlaybookDraftTarget[] {
  const nextDrafts =
    data.drafts && data.drafts.length > 0 ? data.drafts : data.draft ? [data.draft] : [];

  if (nextDrafts.length === 0) return [];

  setDrafts(nextDrafts);
  setDraftTexts(nextDrafts.map((d) => normalizePlaybookMarkdown(d.content)));
  return nextDrafts;
}

export function PlaybookAiChat() {
  const { playbookCtx, pendingMessage, clearPendingMessage } = useRightPanel();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [drafts, setDrafts] = useState<PlaybookDraftTarget[]>([]);
  const [draftTexts, setDraftTexts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [pendingDraftMessageId, setPendingDraftMessageId] = useState<string | null>(null);
  const lastSessionKey = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef(playbookCtx);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    ctxRef.current = playbookCtx;
  }, [playbookCtx]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!playbookCtx) {
      lastSessionKey.current = null;
      return;
    }
    if (playbookCtx.sessionKey === lastSessionKey.current) return;

    lastSessionKey.current = playbookCtx.sessionKey;
    setMessages([]);
    setDrafts([]);
    setDraftTexts([]);
    setPendingDraftMessageId(null);
    setShowVoice(false);
    messagesRef.current = [];

    setIsLoadingHistory(true);
    fetch(`/api/ai/playbook-chat?sessionKey=${encodeURIComponent(playbookCtx.sessionKey)}`)
      .then((r) => r.json())
      .then((data: { messages: { role: string; content: string }[] }) => {
        const history = buildHistoryMessages(data.messages ?? []);
        if (history.length === 0) {
          const opening = {
            id: newId(),
            role: 'assistant' as const,
            content: getOpeningMessage(playbookCtx),
            localOnly: true,
          };
          setMessages([opening]);
          messagesRef.current = [opening];
        } else {
          setMessages(history);
          messagesRef.current = history;
        }
      })
      .catch(() => {
        const opening = {
          id: newId(),
          role: 'assistant' as const,
          content: getOpeningMessage(playbookCtx),
          localOnly: true,
        };
        setMessages([opening]);
        messagesRef.current = [opening];
      })
      .finally(() => setIsLoadingHistory(false));
  }, [playbookCtx]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, draftTexts]);

  useEffect(() => {
    if (pendingMessage && playbookCtx && !isLoadingHistory) {
      clearPendingMessage();
      void sendMessage(pendingMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMessage, isLoadingHistory]);

  useEffect(() => {
    if (!pendingDraftMessageId || drafts.length === 0) return;

    setMessages((prev) => {
      const next = prev.map((msg) =>
        msg.id === pendingDraftMessageId && msg.draftProposal
          ? {
              ...msg,
              draftProposal: {
                ...msg.draftProposal,
                sections: toDraftSections(drafts, draftTexts),
              },
            }
          : msg
      );
      messagesRef.current = next;
      return next;
    });
  }, [draftTexts, drafts, pendingDraftMessageId]);

  const sendMessage = useCallback(async (text: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const trimmed = text.trim();
    if (!trimmed || isLoading || isLoadingHistory) return;

    const userMsg: Message = { id: newId(), role: 'user', content: trimmed };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      messagesRef.current = next;
      return next;
    });
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/playbook-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionKey: ctx.sessionKey,
          intent: ctx.intent,
          userMessage: trimmed,
          entryId: ctx.entryId,
          entryTitle: ctx.entryTitle,
          category: ctx.category,
          categoryLabel: ctx.categoryLabel,
          questionPrompt: ctx.questionPrompt,
          currentSubsection: ctx.currentSubsection,
          currentSubsectionId: ctx.currentSubsectionId,
          subsections: ctx.subsections,
          isSeeded: ctx.isSeeded,
          suggestedQuestions: ctx.suggestedQuestions,
        }),
      });

      const data = (await res.json()) as {
        content?: string;
        draft?: PlaybookDraftTarget | null;
        drafts?: PlaybookDraftTarget[];
        error?: string;
      };

      if (!res.ok) throw new Error(data.error ?? 'Request failed');

      const nextDrafts = applyDraftResponse(data, setDrafts, setDraftTexts);
      const draftMessageId = nextDrafts.length > 0 ? newId() : null;

      setMessages((prev) => {
        let next = draftMessageId ? markPendingDraftsDismissed(prev) : prev;

        if (data.content?.trim()) {
          next = [
            ...next,
            { id: newId(), role: 'assistant' as const, content: data.content ?? '' },
          ];
        }

        if (draftMessageId) {
          next = [
            ...next,
            {
              id: draftMessageId,
              role: 'assistant' as const,
              content: '',
              draftProposal: {
                sections: toDraftSections(nextDrafts, nextDrafts.map((d) => d.content)),
                status: 'pending' as const,
              },
            },
          ];
        }

        messagesRef.current = next;
        return next;
      });

      setPendingDraftMessageId(draftMessageId);
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: newId(),
            role: 'assistant' as const,
            content: errorText,
            localOnly: true,
          },
        ];
        messagesRef.current = next;
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isLoadingHistory]);

  const saveDraftTarget = async (
    target: PlaybookDraftTarget,
    content: string,
    ctx: PlaybookCtx,
    entryId: string | null,
    subsections: PlaybookCtx['subsections']
  ): Promise<{ entryId: string | null; subsections: PlaybookCtx['subsections'] }> => {
    if (target.type === 'new-entry' && !entryId) {
      const res = await fetch('/api/playbook/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: ctx.category,
          title: target.title ?? 'New Entry',
          questionPrompt: target.questionPrompt ?? content.slice(0, 80),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const entry = data.entry as {
        id: string;
        subsections: { id: string; label: string; textContent: string | null }[];
      };

      const nextSubsections = entry.subsections.map((s) => ({
        id: s.id,
        label: s.label,
        textContent: s.textContent,
      }));

      const sub =
        nextSubsections.find(
          (s) =>
            target.subsectionLabel &&
            s.label.toLowerCase() === target.subsectionLabel.toLowerCase()
        ) ?? nextSubsections[0];

      if (sub) {
        await fetch(`/api/playbook/subsections/${sub.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ textContent: normalizePlaybookMarkdown(content) }),
        });
      }

      return { entryId: entry.id, subsections: nextSubsections };
    }

    if (target.type === 'entry-title' && entryId) {
      await fetch(`/api/playbook/entries/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: content }),
      });
      return { entryId, subsections };
    }

    if (target.type === 'entry-question' && entryId) {
      await fetch(`/api/playbook/entries/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionPrompt: content }),
      });
      return { entryId, subsections };
    }

    const subsectionId =
      target.subsectionId ??
      subsections.find(
        (s) =>
          target.subsectionLabel &&
          s.label.toLowerCase() === target.subsectionLabel.toLowerCase()
      )?.id ??
      ctx.currentSubsectionId;

    if (!subsectionId) throw new Error(`Could not find subsection: ${target.subsectionLabel ?? 'unknown'}`);

    await fetch(`/api/playbook/subsections/${subsectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textContent: normalizePlaybookMarkdown(content) }),
    });

    return { entryId, subsections };
  };

  const handleSubmitDraft = async () => {
    const ctx = ctxRef.current;
    if (!ctx || drafts.length === 0) return;

    const hasContent = draftTexts.some((text) => text.trim());
    if (!hasContent) return;

    setSaving(true);
    const draftMessageId = pendingDraftMessageId;
    const savedDrafts = [...drafts];
    const savedDraftTexts = [...draftTexts];

    try {
      let entryId = ctx.entryId;
      let subsections = ctx.subsections;
      let savedCount = 0;

      if (!entryId && ctx.intent === 'add-entry') {
        const newEntryDraft = drafts.find((d) => d.type === 'new-entry');
        const firstContent = draftTexts.find((text) => text.trim())?.trim() ?? '';
        const res = await fetch('/api/playbook/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: ctx.category,
            title: newEntryDraft?.title ?? ctx.entryTitle,
            questionPrompt:
              newEntryDraft?.questionPrompt ??
              ctx.questionPrompt ??
              firstContent.slice(0, 120) ??
              'Interview story',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const entry = data.entry as {
          id: string;
          subsections: { id: string; label: string; textContent: string | null }[];
        };

        entryId = entry.id;
        subsections = entry.subsections.map((s) => ({
          id: s.id,
          label: s.label,
          textContent: s.textContent,
        }));
      }

      for (let i = 0; i < drafts.length; i++) {
        const content = draftTexts[i]?.trim();
        if (!content) continue;

        if (drafts[i].type === 'new-entry' && ctx.intent === 'add-entry' && entryId) {
          const sub =
            subsections.find(
              (s) =>
                drafts[i].subsectionLabel &&
                s.label.toLowerCase() === drafts[i].subsectionLabel!.toLowerCase()
            ) ?? subsections[0];

          if (sub) {
            await fetch(`/api/playbook/subsections/${sub.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ textContent: normalizePlaybookMarkdown(content) }),
            });
            savedCount++;
          }
          continue;
        }

        const result = await saveDraftTarget(drafts[i], content, ctx, entryId, subsections);
        entryId = result.entryId;
        subsections = result.subsections;
        savedCount++;
      }

      setDrafts([]);
      setDraftTexts([]);
      setPendingDraftMessageId(null);

      const savedLabel =
        savedCount > 1 ? `${savedCount} sections saved` : 'Draft saved to playbook';

      setMessages((prev) => {
        const next = prev.map((msg) =>
          msg.id === draftMessageId && msg.draftProposal
            ? {
                ...msg,
                draftProposal: {
                  ...msg.draftProposal,
                  sections: toDraftSections(savedDrafts, savedDraftTexts),
                  status: 'saved' as const,
                },
              }
            : msg
        );
        messagesRef.current = next;
        return next;
      });

      void persistDraftStatusNote(ctx.sessionKey, 'saved', savedLabel);
      ctx.onSaved?.();
    } catch (err) {
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: newId(),
            role: 'assistant' as const,
            content: `Could not save: ${err instanceof Error ? err.message : 'Unknown error'}`,
            localOnly: true,
          },
        ];
        messagesRef.current = next;
        return next;
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardDraft = () => {
    const ctx = ctxRef.current;
    if (drafts.length === 0) return;

    const draftMessageId = pendingDraftMessageId;
    const dismissedDrafts = [...drafts];
    const dismissedDraftTexts = [...draftTexts];
    const sectionNames = dismissedDrafts.map(draftLabel).join(', ');

    setDrafts([]);
    setDraftTexts([]);
    setPendingDraftMessageId(null);

    setMessages((prev) => {
      const next = prev.map((msg) =>
        msg.id === draftMessageId && msg.draftProposal
          ? {
              ...msg,
              draftProposal: {
                ...msg.draftProposal,
                sections: toDraftSections(dismissedDrafts, dismissedDraftTexts),
                status: 'dismissed' as const,
              },
            }
          : msg
      );
      messagesRef.current = next;
      return next;
    });

    if (ctx) {
      void persistDraftStatusNote(ctx.sessionKey, 'dismissed', sectionNames);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setShowVoice(false);
    setInput(transcript);
  };

  if (!playbookCtx) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory && (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.draftProposal ? (
              <DraftProposalBubble
                sections={msg.draftProposal.sections}
                status={msg.draftProposal.status}
              />
            ) : (
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand text-white rounded-br-sm'
                    : 'bg-bg-subtle text-text-primary rounded-bl-sm border border-border-subtle'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                      ),
                      li: ({ children }) => <li>{children}</li>,
                    }}
                  >
                    {normalizePlaybookMarkdown(msg.content)}
                  </ReactMarkdown>
                )}
              </div>
            )}
          </div>
        ))}

        {playbookCtx.intent === 'add-entry' &&
          playbookCtx.suggestedQuestions &&
          messages.length <= 1 && (
            <div className="space-y-2">
              <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wide">
                Suggested questions
              </p>
              {playbookCtx.suggestedQuestions.slice(0, 5).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendMessage(`I want to answer: "${q}"`)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-border-subtle bg-bg-subtle hover:border-brand hover:bg-brand-light font-body text-sm text-text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-subtle rounded-2xl px-4 py-3 border border-border-subtle">
              <Spinner size="sm" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {drafts.length > 0 && (
        <div className="flex-shrink-0 border-t-2 border-brand bg-brand-light p-4 space-y-3 max-h-[45vh] overflow-y-auto">
          <p className="font-body text-sm font-semibold text-text-primary">
            📝 Review draft
            {drafts.length === 1
              ? ` — ${draftLabel(drafts[0])}`
              : ` — ${drafts.length} sections`}
          </p>
          <div className="space-y-3">
            {drafts.map((draft, index) => (
              <div key={`${draftLabel(draft)}-${index}`} className="space-y-1">
                <p className="font-body text-xs font-semibold text-text-primary uppercase tracking-wide">
                  {draftLabel(draft)}
                </p>
                <textarea
                  value={draftTexts[index] ?? ''}
                  onChange={(e) => {
                    const next = [...draftTexts];
                    next[index] = e.target.value;
                    setDraftTexts(next);
                  }}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-surface font-body text-sm text-text-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => void handleSubmitDraft()}
              disabled={saving || !draftTexts.some((text) => text.trim())}
            >
              {saving
                ? 'Saving…'
                : drafts.length > 1
                  ? `Submit all ${drafts.length} to Save`
                  : 'Submit to Save'}
            </Button>
            <Button variant="secondary" onClick={handleDiscardDraft}>
              Discard
            </Button>
          </div>
        </div>
      )}

      <div className="flex-shrink-0 border-t border-border-subtle p-3 bg-bg-surface space-y-2">
        {showVoice ? (
          <div className="space-y-2">
            <VoiceInterviewRecorder
              onTranscriptReady={(transcript) => handleVoiceTranscript(transcript)}
            />
            <Button variant="secondary" onClick={() => setShowVoice(false)}>
              Cancel recording
            </Button>
          </div>
        ) : (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(input);
                }
              }}
              placeholder="Tell the AI what you want to add or change…"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => void sendMessage(input)}
                disabled={isLoading || isLoadingHistory || !input.trim()}
                className="flex-1"
              >
                Send
              </Button>
              <Button variant="secondary" onClick={() => setShowVoice(true)} title="Record answer">
                🎙️
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
