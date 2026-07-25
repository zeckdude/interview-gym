'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const CACHE_KEY = 'interview-gym-weakness-analysis';
const CACHE_DURATION_MS = 60 * 60 * 1000;

interface CachedAnalysis {
  analysis: string;
  timestamp: number;
}

function parseAnalysisSections(text: string) {
  const weaknessesMatch = text.match(/## Weaknesses([\s\S]*?)(?=## Strengths|$)/i);
  const strengthsMatch = text.match(/## Strengths([\s\S]*?)(?=## 3-Day Plan|$)/i);
  const planMatch = text.match(/## 3-Day Plan([\s\S]*?)$/i);

  return {
    weaknesses: weaknessesMatch?.[1]?.trim() ?? text,
    strengths: strengthsMatch?.[1]?.trim() ?? '',
    plan: planMatch?.[1]?.trim() ?? '',
  };
}

function renderBullets(text: string) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <ul className="space-y-2">
      {lines.map((line, i) => (
        <li key={i} className="font-body text-base text-text-primary flex gap-2">
          <span className="text-brand flex-shrink-0">•</span>
          <span>{line.replace(/^[-•]\s*/, '')}</span>
        </li>
      ))}
    </ul>
  );
}

export function WeaknessAnalysisPanel() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRefresh, setCanRefresh] = useState(true);
  const [cacheAge, setCacheAge] = useState<number | null>(null);

  const loadFromCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw) as CachedAnalysis;
      setCacheAge(cached.timestamp);
      if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        setCanRefresh(false);
        return cached.analysis;
      }
      setCanRefresh(true);
    } catch {
      /* ignore */
    }
    return null;
  }, []);

  const saveToCache = useCallback((text: string) => {
    try {
      const cached: CachedAnalysis = { analysis: text, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch {
      /* ignore */
    }
  }, []);

  const runAnalysis = useCallback(
    async (force = false) => {
      if (!force) {
        const cached = loadFromCache();
        if (cached) {
          setAnalysis(cached);
          return;
        }
      } else if (!canRefresh) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/ai/weakness-analysis', { method: 'POST' });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Analysis failed');
        }
        const data = await res.json();
        setAnalysis(data.analysis);
        saveToCache(data.analysis);
        setCacheAge(Date.now());
        setCanRefresh(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    [loadFromCache, saveToCache, canRefresh]
  );

  useEffect(() => {
    const cached = loadFromCache();
    if (cached) {
      setAnalysis(cached);
      setCanRefresh(false);
    }
  }, [loadFromCache]);

  const sections = analysis ? parseAnalysisSections(analysis) : null;

  return (
    <section className="bg-bg-surface border border-border-subtle rounded-xl shadow-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-xl text-text-primary">
            AI Weakness Analysis
          </h2>
          <p className="font-body text-sm text-text-muted">
            Get a coach-style read on where to focus next.
          </p>
        </div>
        {!analysis && !loading && (
          <Button onClick={() => runAnalysis(false)}>Analyze My Weaknesses</Button>
        )}
        {analysis && (
          <Button
            variant="secondary"
            onClick={() => runAnalysis(true)}
            disabled={!canRefresh || loading}
            title={
              !canRefresh && cacheAge
                ? `Refresh available in ${Math.ceil((CACHE_DURATION_MS - (Date.now() - cacheAge)) / 60000)} min`
                : undefined
            }
          >
            Refresh Analysis
          </Button>
        )}
      </div>

      {loading && (
        <div className="bg-brand-light border border-brand/20 rounded-lg px-4 py-6 text-center space-y-2">
          <p className="font-body text-base text-text-primary font-semibold">
            Analyzing your performance data...
          </p>
          <p className="font-body text-sm text-text-muted">
            Claude is reviewing your stats and weak spots.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-warning-light border border-warning rounded-lg px-4 py-3">
          <p className="font-body text-sm text-text-primary">{error}</p>
        </div>
      )}

      {sections && !loading && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-warning-light border border-warning rounded-lg p-4 space-y-3">
            <h3 className="font-display font-bold text-lg text-text-primary">Weaknesses</h3>
            {renderBullets(sections.weaknesses)}
          </div>
          <div className="bg-success-light border border-success rounded-lg p-4 space-y-3">
            <h3 className="font-display font-bold text-lg text-text-primary">Strengths</h3>
            {sections.strengths ? (
              renderBullets(sections.strengths)
            ) : (
              <p className="font-body text-base text-text-primary">Keep building momentum.</p>
            )}
          </div>
          <div className="bg-brand-light border border-brand/30 rounded-lg p-4 space-y-3">
            <h3 className="font-display font-bold text-lg text-text-primary">3-Day Plan</h3>
            {sections.plan ? (
              renderBullets(sections.plan)
            ) : (
              <p className="font-body text-base text-text-primary">
                Focus on your weakest category first.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
