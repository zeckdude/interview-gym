'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ScoreTrendChart } from '@/components/simulator/ScoreTrendChart';
import { formatDurationMs, getCategoryLabel, getScoreMessage } from '@/lib/simulator';
import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';
import { cn } from '@/lib/utils';

interface HistoryChallenge {
  id: string;
  challengeId: string;
  title: string;
  difficulty?: ChallengeDifficulty;
  category?: ChallengeCategory;
  order: number;
  passed: boolean | null;
  timeSpentMs: number | null;
  aiFeedback: string | null;
}

interface HistorySession {
  id: string;
  startedAt: string;
  completedAt: string | null;
  difficulty: string;
  category: string;
  durationMinutes: number;
  totalScore: number | null;
  passed: number;
  total: number;
  challenges: HistoryChallenge[];
}

interface Analytics {
  avgTimedPassRate: number;
  avgUntimedPassRate: number;
  difference: number;
  fastestCategory: string;
  slowestCategory: string;
}

interface HistoryResponse {
  history: HistorySession[];
  analytics: Analytics | null;
  scoreTrend: Array<{ date: string; score: number }>;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SimulatorHistory() {
  const { data, isLoading } = useSWR<HistoryResponse>('/api/simulator/history', fetcher);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const history = data?.history ?? [];
  const analytics = data?.analytics;
  const scoreTrend = data?.scoreTrend ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/simulator"
          className="font-body text-sm text-brand hover:text-brand-dark font-semibold"
        >
          ← Back to Simulator
        </Link>
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Session History
        </h1>
      </div>

      {/* Analytics card */}
      {analytics && (
        <div className="bg-warning-light border-l-4 border-warning rounded-r-lg px-6 py-5 space-y-2">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Time Pressure Insights
          </h2>
          <p className="font-body text-base text-text-primary leading-relaxed">
            {analytics.difference < 0 ? (
              <>
                Under pressure, your pass rate drops by{' '}
                <strong>{Math.abs(analytics.difference)}%</strong> (
                {analytics.avgTimedPassRate}% timed vs {analytics.avgUntimedPassRate}% untimed).
              </>
            ) : analytics.difference > 0 ? (
              <>
                You thrive under pressure — pass rate is{' '}
                <strong>{analytics.difference}% higher</strong> in timed sessions.
              </>
            ) : (
              <>Your pass rate is consistent under pressure and in practice.</>
            )}{' '}
            You&apos;re fastest on <strong>{analytics.fastestCategory}</strong> and slowest on{' '}
            <strong>{analytics.slowestCategory}</strong>.
          </p>
        </div>
      )}

      {/* Score trend */}
      <ScoreTrendChart data={scoreTrend} />

      {/* Session list */}
      {history.length === 0 ? (
        <div className="bg-bg-surface rounded-xl shadow-card p-8 text-center space-y-4">
          <p className="font-body text-base text-text-primary">
            No completed sessions yet. Start your first mock interview!
          </p>
          <Link
            href="/simulator"
            className="font-body text-base text-brand hover:text-brand-dark font-semibold"
          >
            Start a Session →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => {
            const score = session.totalScore ?? 0;
            const { colorClass } = getScoreMessage(score);
            const isExpanded = expandedId === session.id;
            const dateStr = new Date(session.startedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={session.id}
                className="bg-bg-surface rounded-xl shadow-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-bg-subtle/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-base text-text-primary font-semibold">
                      {dateStr}
                    </p>
                    <p className="font-body text-sm text-text-muted">
                      {session.difficulty} · {getCategoryLabel(session.category as never)} ·{' '}
                      {session.durationMinutes} min · {session.passed}/{session.total} passed
                    </p>
                  </div>
                  <span className={cn('font-display font-bold text-2xl', colorClass)}>
                    {score}
                  </span>
                  <span className="text-text-muted text-sm">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-border-subtle px-6 py-4 space-y-3">
                    {session.challenges.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-4 py-2"
                      >
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          {c.difficulty && (
                            <Badge type="difficulty" value={c.difficulty} />
                          )}
                          <span className="font-body text-base text-text-primary truncate">
                            {c.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {c.timeSpentMs && (
                            <span className="font-body text-sm text-text-muted">
                              {formatDurationMs(c.timeSpentMs)}
                            </span>
                          )}
                          <span
                            className={cn(
                              'font-body text-sm font-semibold',
                              c.passed ? 'text-success' : 'text-error'
                            )}
                          >
                            {c.passed ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link
                      href={`/simulator/${session.id}/results`}
                      className="inline-block font-body text-sm text-brand hover:text-brand-dark font-semibold pt-2"
                    >
                      View full results →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
