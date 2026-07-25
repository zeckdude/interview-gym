'use client';

import { useEffect, useCallback, useState } from 'react';
import { CopyableCodeBlock } from '@/components/ui/CopyableCodeBlock';

interface ConceptParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface ConceptReturn {
  type: string;
  description: string;
  learnMoreUrl?: string | null;
  learnMoreLabel?: string | null;
}

interface CodeApproach {
  name: string;
  codeSnippet: string;
  language: 'javascript' | 'typescript';
  pros: string[];
  cons: string[];
}

interface ConceptData {
  explanation: string;
  parameters: ConceptParameter[] | null;
  returns: ConceptReturn | null;
  proTips: [string, string];
  approaches: CodeApproach[];
  recommendedApproach: string;
  recommendation: string;
  resourceUrl: string;
  resourceLabel: string;
  _placeholder?: true;
}

interface ConceptDrawerProps {
  concept: string | null;
  challengeTitle: string;
  onClose: () => void;
}

const cacheKey = (concept: string) =>
  `concept-explanation:v8:${concept.toLowerCase().replace(/\s+/g, '-')}`;

async function fetchConceptExplanation(
  concept: string,
  challengeContext: string
): Promise<ConceptData> {
  const key = cacheKey(concept);
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached) as ConceptData;

  const res = await fetch('/api/ai/concept-explanation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concept, challengeContext }),
  });

  if (!res.ok) throw new Error('Failed to fetch concept explanation');

  const data = (await res.json()) as ConceptData;
  if (!data._placeholder) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  return data;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

function ApproachCard({
  approach,
  isRecommended,
}: {
  approach: CodeApproach;
  isRecommended: boolean;
}) {
  const lineCount = approach.codeSnippet.split('\n').length;
  const editorHeight = `${Math.max(120, Math.min(lineCount * 20 + 40, 280))}px`;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isRecommended ? 'border-brand' : 'border-border-subtle'
      }`}
    >
      {/* Approach header */}
      <div
        className={`flex items-center justify-between gap-2 px-3 py-2 ${
          isRecommended ? 'bg-brand-light' : 'bg-bg-subtle'
        }`}
      >
        <span
          className={`font-display font-bold text-xs leading-snug ${
            isRecommended ? 'text-brand' : 'text-text-secondary'
          }`}
        >
          {approach.name}
        </span>
        {isRecommended && (
          <span className="whitespace-nowrap flex-shrink-0 text-xs font-body font-bold text-white bg-brand px-2.5 py-1 rounded-full shadow-brand">
            ★ Best choice
          </span>
        )}
      </div>

      {/* Pros / Cons */}
      <div className="px-3 py-2 grid grid-cols-2 gap-2 border-b border-border-subtle bg-bg-surface">
        <div>
          {approach.pros.map((pro, i) => (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="text-success text-xs mt-0.5 flex-shrink-0">✓</span>
              <span className="font-body text-xs text-text-secondary leading-snug">{pro}</span>
            </div>
          ))}
        </div>
        <div>
          {approach.cons.map((con, i) => (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="text-error text-xs mt-0.5 flex-shrink-0">✕</span>
              <span className="font-body text-xs text-text-secondary leading-snug">{con}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code */}
      <CopyableCodeBlock
        code={approach.codeSnippet}
        language={approach.language}
        height={editorHeight}
      />
    </div>
  );
}

export function ConceptDrawer({ concept, challengeTitle, onClose }: ConceptDrawerProps) {
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
    if (open && concept) load();
  }, [concept, open, load]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[28rem] bg-bg-surface shadow-modal z-50 flex flex-col transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={concept ? `Concept: ${concept}` : 'Concept panel'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle flex-shrink-0">
          <h2 className="font-display text-lg font-bold text-text-primary">{concept}</h2>
          <button
            onClick={onClose}
            aria-label="Close concept panel"
            className="text-text-muted hover:text-text-primary w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-subtle transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-16">
          {/* Loading skeleton */}
          {loading && (
            <div className="p-6 space-y-4">
              <div className="h-3 bg-bg-subtle rounded animate-pulse w-1/3" />
              <div className="h-4 bg-bg-subtle rounded animate-pulse w-full" />
              <div className="h-4 bg-bg-subtle rounded animate-pulse w-5/6" />
              <div className="h-3 bg-bg-subtle rounded animate-pulse w-1/3 mt-4" />
              <div className="h-20 bg-bg-subtle rounded animate-pulse" />
              <div className="h-3 bg-bg-subtle rounded animate-pulse w-1/3 mt-4" />
              <div className="h-48 bg-bg-subtle rounded animate-pulse" />
              <div className="h-48 bg-bg-subtle rounded animate-pulse" />
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

              {/* What it is */}
              <div>
                <SectionLabel>What it is</SectionLabel>
                <p className="font-body text-sm text-text-primary leading-relaxed">
                  {data.explanation}
                </p>
              </div>

              {/* Parameters */}
              {data.parameters && data.parameters.length > 0 && (
                <div>
                  <SectionLabel>Parameters</SectionLabel>
                  <div className="space-y-2">
                    {data.parameters.map((p) => (
                      <div
                        key={p.name}
                        className="bg-bg-subtle rounded-lg p-3 border border-border-subtle"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono text-xs font-bold text-text-primary">
                            {p.name}
                          </code>
                          <span className="font-mono text-xs bg-brand-light text-brand px-1.5 py-0.5 rounded font-semibold">
                            {p.type}
                          </span>
                          {!p.required && (
                            <span className="text-xs font-body text-text-muted italic">
                              optional
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-text-secondary leading-snug">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Returns */}
              {data.returns && (
                <div>
                  <SectionLabel>Returns</SectionLabel>
                  <div className="bg-bg-subtle rounded-lg p-3 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs bg-brand-light text-brand px-1.5 py-0.5 rounded font-semibold">
                        {data.returns.type}
                      </span>
                      {data.returns.learnMoreUrl && data.returns.learnMoreLabel && (
                        <a
                          href={data.returns.learnMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-body font-semibold text-brand hover:text-brand-dark transition-colors"
                        >
                          <span>what&apos;s this?</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                    <p className="font-body text-xs text-text-secondary leading-snug">
                      {data.returns.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Tips */}
              {data.proTips && data.proTips.length > 0 && (
                <div>
                  <SectionLabel>Tips for this challenge</SectionLabel>
                  <div className="space-y-2">
                    {data.proTips.map((tip, i) => (
                      <div
                        key={i}
                        className={`flex gap-2.5 p-3 rounded-lg border text-xs font-body leading-snug ${
                          i === 0
                            ? 'bg-brand-light border-brand/20 text-text-primary'
                            : 'bg-warning-light border-warning/20 text-text-primary'
                        }`}
                      >
                        <span className="flex-shrink-0 mt-px">{i === 0 ? '💡' : '⚠️'}</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approaches */}
              {data.approaches && data.approaches.length > 0 && (
                <div>
                  <SectionLabel>
                    {data.approaches.length === 1 ? 'Example' : `${data.approaches.length} Ways to Do It`}
                  </SectionLabel>
                  <div className="space-y-4">
                    {data.approaches.map((approach, i) => (
                      <ApproachCard
                        key={i}
                        approach={approach}
                        isRecommended={
                          data.approaches.length > 1 &&
                          approach.name === data.recommendedApproach
                        }
                      />
                    ))}
                  </div>

                  {/* Recommendation callout */}
                  {data.approaches.length > 1 && data.recommendation && (
                    <div className="mt-3 flex gap-2.5 p-3 rounded-lg border bg-success-light border-success/20 text-xs font-body leading-snug text-text-primary">
                      <span className="flex-shrink-0 mt-px">✅</span>
                      <span>{data.recommendation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Learn more */}
              <div>
                <SectionLabel>Learn more</SectionLabel>
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
        <div className="absolute bottom-0 left-0 right-0 px-6 py-3 border-t border-border-subtle bg-bg-surface">
          <p className="font-body text-xs text-text-muted">
            📚 Viewing resources is encouraged — looking up syntax is what real engineers do.
          </p>
        </div>
      </div>
    </>
  );
}
