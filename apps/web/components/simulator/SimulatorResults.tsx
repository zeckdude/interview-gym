'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CategoryBreakdown } from '@/components/simulator/CategoryBreakdown';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { StudyPlanQuickAdd } from '@/components/study-plan/StudyPlanQuickAdd';
import { formatDurationMs, getScoreMessage } from '@/lib/simulator';
import { getLessonForChallenge } from '@/lib/lesson-for-challenge';
import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';
import { cn } from '@/lib/utils';

interface ChallengeResult {
  id: string;
  order: number;
  challengeId: string;
  title: string;
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
  passed: boolean | null;
  timeSpentMs: number | null;
  aiFeedback: string | null;
  personalBestMs: number | null;
}

interface SessionResult {
  id: string;
  totalScore: number | null;
  challenges: ChallengeResult[];
}

interface SimulatorResultsProps {
  sessionId: string;
}

function FeedbackSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-bg-subtle rounded w-full" />
      <div className="h-4 bg-bg-subtle rounded w-5/6" />
      <div className="h-4 bg-bg-subtle rounded w-4/6" />
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: ChallengeResult }) {
  const [feedback, setFeedback] = useState(challenge.aiFeedback);
  const [loadingFeedback, setLoadingFeedback] = useState(!challenge.aiFeedback);
  const lesson = getLessonForChallenge(challenge.challengeId);

  useEffect(() => {
    if (challenge.aiFeedback) {
      setFeedback(challenge.aiFeedback);
      setLoadingFeedback(false);
      return;
    }

    let cancelled = false;
    async function fetchFeedback() {
      try {
        const res = await fetch('/api/ai/simulator-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ simulatorChallengeId: challenge.id }),
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setFeedback(data.feedback);
        }
      } finally {
        if (!cancelled) setLoadingFeedback(false);
      }
    }

    fetchFeedback();
    return () => {
      cancelled = true;
    };
  }, [challenge.id, challenge.aiFeedback]);

  const timeSpent = challenge.timeSpentMs
    ? formatDurationMs(challenge.timeSpentMs)
    : '—';
  const personalBest = challenge.personalBestMs
    ? formatDurationMs(challenge.personalBestMs)
    : null;

  const slowerThanBest =
    challenge.personalBestMs &&
    challenge.timeSpentMs &&
    challenge.passed &&
    challenge.timeSpentMs > challenge.personalBestMs;

  return (
    <div className="bg-bg-surface rounded-xl shadow-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {challenge.difficulty && (
              <Badge type="difficulty" value={challenge.difficulty} />
            )}
            {challenge.category && (
              <Badge type="category" value={challenge.category} />
            )}
          </div>
          <h3 className="font-display font-semibold text-lg text-text-primary">
            {challenge.title}
          </h3>
        </div>
        <span
          className={cn(
            'font-display font-bold text-2xl',
            challenge.passed ? 'text-success' : 'text-error'
          )}
        >
          {challenge.passed ? '✓ Pass' : '✗ Fail'}
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-bg-subtle rounded-lg px-4 py-2">
          <p className="font-body text-sm text-text-muted">Time spent</p>
          <p className="font-body text-base text-text-primary font-semibold">
            {timeSpent}
          </p>
        </div>
        {personalBest && (
          <div className="bg-bg-subtle rounded-lg px-4 py-2">
            <p className="font-body text-sm text-text-muted">Your best</p>
            <p className="font-body text-base text-text-primary font-semibold">
              {personalBest}
              {slowerThanBest && ' 🔺'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-brand-light border-l-4 border-brand rounded-r-lg px-5 py-4">
        <p className="font-display font-semibold text-sm text-brand mb-2">
          AI Feedback
        </p>
        {loadingFeedback ? (
          <FeedbackSkeleton />
        ) : (
          <div className="font-body text-base text-text-primary leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown>{feedback ?? 'Feedback unavailable.'}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        {lesson && (
          <Link
            href={`/lessons/${lesson.id}`}
            className="font-body text-base text-brand hover:text-brand-dark font-semibold"
          >
            Go to Lesson →
          </Link>
        )}
        <Link
          href={`/challenges/${challenge.challengeId}`}
          className="font-body text-base text-brand hover:text-brand-dark font-semibold"
        >
          Practice This Challenge →
        </Link>
        {challenge.passed === false && (
          <StudyPlanQuickAdd
            itemType="challenge"
            itemId={challenge.challengeId}
            source="simulator"
            className="font-body text-sm font-semibold px-3 py-1.5 rounded-md border border-border-subtle bg-bg-subtle text-text-primary hover:border-brand hover:text-brand transition-colors disabled:opacity-60"
          />
        )}
      </div>
    </div>
  );
}

export function SimulatorResults({ sessionId }: SimulatorResultsProps) {
  const [session, setSession] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/simulator/${sessionId}`);
        if (res.ok) {
          setSession(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="font-body text-base text-text-primary">Session not found.</p>
        <Link href="/simulator">
          <Button>Back to Simulator</Button>
        </Link>
      </div>
    );
  }

  const score = session.totalScore ?? 0;
  const { text: scoreMessage, colorClass } = getScoreMessage(score);

  return (
    <div className="space-y-8">
      <ContentBreadcrumbs
        items={[
          { label: 'Simulator', href: '/simulator' },
          { label: 'Session Results' },
        ]}
      />

      {/* Score banner */}
      <div className="bg-bg-surface rounded-xl shadow-card p-8 text-center space-y-3">
        <p className="font-body text-base text-text-muted uppercase tracking-wide font-semibold">
          Session Score
        </p>
        <p className={cn('font-display font-bold text-6xl', colorClass)}>
          {score} / 100
        </p>
        <p className={cn('font-body text-lg font-semibold', colorClass)}>
          {scoreMessage}
        </p>
      </div>

      {/* Per-challenge breakdown */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-text-primary">
          Challenge Breakdown
        </h2>
        <div className="space-y-6">
          {session.challenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <CategoryBreakdown challenges={session.challenges} />

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Link href="/simulator">
          <Button>Start Another Session</Button>
        </Link>
        <Link href="/simulator/history">
          <Button variant="secondary">View History</Button>
        </Link>
      </div>
    </div>
  );
}
