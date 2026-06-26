'use client';

import { useEffect, useCallback, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ConceptData {
  explanation: string;
  codeSnippet: string;
  language: 'javascript' | 'typescript';
  resourceUrl: string;
  resourceLabel: string;
}

interface ConceptDrawerProps {
  concept: string | null;
  challengeTitle: string;
  onClose: () => void;
}

const cacheKey = (concept: string) =>
  `concept-explanation:${concept.toLowerCase().replace(/\s+/g, '-')}`;

async function fetchConceptExplanation(
  concept: string,
  challengeContext: string
): Promise<ConceptData> {
  const cached = localStorage.getItem(cacheKey(concept));
  if (cached) return JSON.parse(cached) as ConceptData;

  const res = await fetch('/api/ai/concept-explanation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, challengeContext }),
  });

  if (!res.ok) throw new Error('Failed to fetch concept explanation');

  const data = (await res.json()) as ConceptData;
  localStorage.setItem(cacheKey(concept), JSON.stringify(data));
  return data;
}

export function ConceptDrawer({ concept, challengeTitle, onClose }: ConceptDrawerProps) {
  const { theme } = useTheme();
  const open = concept !== null;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConceptData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!concept) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchConceptExplanation(concept, challengeTitle);
      setData(result);
    } catch {
      setError('Failed to load explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [concept, challengeTitle]);

  useEffect(() => {
    if (open && concept) {
      load();
    }
  }, [concept, open, load]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-bg-surface dark:bg-[#1A1A1A] shadow-modal z-50 flex flex-col transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={concept ? `Concept: ${concept}` : 'Concept panel'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle dark:border-[#2A2A2A] flex-shrink-0">
          <h2 className="font-display text-lg font-bold text-text-primary dark:text-[#F0EDE8]">
            {concept}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close concept panel"
            className="text-text-muted hover:text-text-primary dark:hover:text-[#F0EDE8] w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-subtle dark:hover:bg-[#252525] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-16">
          {/* Loading skeleton */}
          {loading && (
            <div className="p-6 space-y-4">
              <div className="h-4 bg-bg-subtle dark:bg-[#252525] rounded animate-pulse w-3/4" />
              <div className="h-4 bg-bg-subtle dark:bg-[#252525] rounded animate-pulse w-full" />
              <div className="h-4 bg-bg-subtle dark:bg-[#252525] rounded animate-pulse w-5/6" />
              <div className="h-4 bg-bg-subtle dark:bg-[#252525] rounded animate-pulse w-2/3 mt-6" />
              <div className="h-40 bg-bg-subtle dark:bg-[#252525] rounded animate-pulse" />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="p-6">
              <div className="bg-error-light border border-error/20 rounded-lg p-4">
                <p className="font-body text-sm text-error">{error}</p>
                <button
                  onClick={load}
                  className="mt-3 text-sm font-body font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Try again →
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && data && (
            <div className="p-6 space-y-6">
              {/* Explanation */}
              <div>
                <h3 className="font-display text-xs font-bold text-text-muted dark:text-[#8A8580] uppercase tracking-widest mb-2">
                  What it is
                </h3>
                <p className="font-body text-sm text-text-primary dark:text-[#F0EDE8] leading-relaxed">
                  {data.explanation}
                </p>
              </div>

              {/* Code snippet */}
              <div>
                <h3 className="font-display text-xs font-bold text-text-muted dark:text-[#8A8580] uppercase tracking-widest mb-2">
                  Example
                </h3>
                <div className="rounded-lg overflow-hidden border border-border-subtle dark:border-[#2A2A2A]">
                  <div className="bg-bg-subtle dark:bg-[#252525] px-3 py-1.5 border-b border-border-subtle dark:border-[#2A2A2A]">
                    <span className="font-mono text-xs text-text-muted dark:text-[#8A8580]">
                      {data.language}
                    </span>
                  </div>
                  <Editor
                    height="160px"
                    language={data.language}
                    value={data.codeSnippet}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      lineNumbers: 'off',
                      scrollBeyondLastLine: false,
                      padding: { top: 12, bottom: 12 },
                      fontSize: 13,
                      fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    }}
                  />
                </div>
              </div>

              {/* External resource link */}
              <div>
                <h3 className="font-display text-xs font-bold text-text-muted dark:text-[#8A8580] uppercase tracking-widest mb-2">
                  Learn more
                </h3>
                <a
                  href={data.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand hover:text-brand-dark font-body text-sm font-semibold transition-colors group"
                >
                  <span>📖</span>
                  <span className="flex-1">{data.resourceLabel}</span>
                  <span className="text-text-muted group-hover:text-brand transition-colors">↗</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-3 border-t border-border-subtle dark:border-[#2A2A2A] bg-bg-surface dark:bg-[#1A1A1A]">
          <p className="font-body text-xs text-text-muted dark:text-[#8A8580]">
            📚 Viewing resources is encouraged — looking up syntax is what real engineers do.
          </p>
        </div>
      </div>
    </>
  );
}
