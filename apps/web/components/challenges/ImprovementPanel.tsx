'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReadOnlyCodeEditor } from '@/components/editor/ReadOnlyCodeEditor';
import type { ChallengeLanguage } from '@/data/types';

interface ImprovementPanelProps {
  open: boolean;
  onClose: () => void;
  challengeId: string;
  userCode: string;
  language: ChallengeLanguage;
  onImproveUsed: () => void;
}

interface ParsedSuggestion {
  category: string;
  body: string;
  code: string | null;
}

function parseSuggestions(content: string, language: ChallengeLanguage): ParsedSuggestion[] {
  const blocks = content.split(/\*\*\[/).slice(1);
  return blocks.map((block) => {
    const categoryEnd = block.indexOf(']:**');
    const category = categoryEnd >= 0 ? block.slice(0, categoryEnd).trim() : 'Suggestion';
    const rest = categoryEnd >= 0 ? block.slice(categoryEnd + 4) : block;

    const codeMatch = rest.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const code = codeMatch?.[1]?.trim() ?? null;
    const body = rest.replace(/```[\s\S]*?```/g, '').trim();

    return { category, body, code };
  });
}

export function ImprovementPanel({
  open,
  onClose,
  challengeId,
  userCode,
  language,
  onImproveUsed,
}: ImprovementPanelProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const improveUsedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setContent(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (content !== null || loading) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    if (!improveUsedRef.current) {
      improveUsedRef.current = true;
      onImproveUsed();
    }

    fetch('/api/ai/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, userCode, language }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Failed to get suggestions');
        }
        return res.json() as Promise<{ content: string }>;
      })
      .then((data) => {
        if (!cancelled) setContent(data.content);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const suggestions = content ? parseSuggestions(content, language) : [];

  return (
    <div className="mt-4 bg-bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-brand-light/20">
        <div>
          <h3 className="font-display font-semibold text-base text-text-primary">
            ✨ How to Improve
          </h3>
          <p className="font-body text-sm text-text-secondary mt-0.5">
            Quality tips — performance, readability, modern syntax.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close improvement panel"
          className="text-text-muted hover:text-text-primary text-lg leading-none px-2"
        >
          ×
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {loading && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="font-body text-base text-text-secondary">Reviewing your code…</p>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-lg bg-error-light border border-error text-error font-body text-sm">
            {error}
          </div>
        )}

        {suggestions.length > 0 ? (
          suggestions.map((s, i) => (
            <div
              key={i}
              className="bg-bg-subtle rounded-lg p-5 border-l-4 border-brand space-y-3"
            >
              <h4 className="font-display font-semibold text-sm text-brand uppercase tracking-wide">
                {s.category}
              </h4>
              <div className="font-body text-base text-text-primary prose prose-sm max-w-none">
                <ReactMarkdown>{s.body}</ReactMarkdown>
              </div>
              {s.code && (
                <ReadOnlyCodeEditor language={language} value={s.code} height="180px" />
              )}
            </div>
          ))
        ) : content ? (
          <div className="font-body text-base text-text-primary prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : null}
      </div>
    </div>
  );
}
