'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AudioPlayer } from '@/components/systems-design/AudioPlayer';
import { PlaybookFormattedText } from '@/components/playbook/PlaybookFormattedText';
import {
  getCategoryLabel,
  getVoiceQuestionById,
  type VoiceInterviewQuestion,
} from '@/data/voice-interviews';

interface Exchange {
  id?: string;
  order: number;
  questionId?: string | null;
  questionText: string;
  questionType: string;
  answerTranscript?: string | null;
  answerAudioUrl?: string | null;
  answerDurationSec?: number | null;
  fillerWordCount?: number | null;
  wordsPerMinute?: number | null;
  deepgramConfidence?: number | null;
  aiContentScore?: number | null;
  aiContentFeedback?: string | null;
  aiGaps?: string[] | null;
}

interface SessionData {
  id: string;
  category: string;
  difficulty: string;
  questionIds: string[];
  sessionQuestionCount: number;
  startedAt: string;
  completedAt: string | null;
  overallScore: number | null;
  contentScore: number | null;
  communicationScore: number | null;
  aiFeedback: string | null;
  exchanges: Exchange[];
}

interface VoiceInterviewResultsProps {
  session: SessionData;
  questions: VoiceInterviewQuestion[];
  onPracticeAgain: (questionId: string) => Promise<void>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function estimateDurationMinutes(exchanges: Exchange[]): number {
  const secs = exchanges.reduce((sum, e) => sum + (e.answerDurationSec ?? 60), 0);
  return Math.max(1, Math.round(secs / 60));
}

export function VoiceInterviewResults({
  session,
  questions,
  onPracticeAgain,
}: VoiceInterviewResultsProps) {
  const [expandedExchange, setExpandedExchange] = useState<number | null>(null);
  const [reviewQueued, setReviewQueued] = useState(false);
  const [practicing, setPracticing] = useState(false);

  const categoryLabel =
    session.category === 'mixed'
      ? 'Mixed'
      : getCategoryLabel(session.category as Parameters<typeof getCategoryLabel>[0]);

  const primaryQuestionId = session.questionIds[0];

  const handleAddToReview = async () => {
    if (!primaryQuestionId) return;
    const res = await fetch('/api/voice-interviews/review-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: primaryQuestionId }),
    });
    if (res.ok) setReviewQueued(true);
  };

  const getResourcesForExchange = (exchange: Exchange) => {
    const qId = exchange.questionId ?? session.questionIds[0];
    const question = getVoiceQuestionById(qId ?? '') ?? questions.find((q) => q.id === qId);
    if (!question) return { lessons: [], external: [] };
    const hasGaps = (exchange.aiGaps?.length ?? 0) > 0 || (exchange.aiContentScore ?? 100) < 70;
    if (!hasGaps) return { lessons: [], external: [] };
    return {
      lessons: question.relatedLessonIds,
      external: question.externalResources,
    };
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Interview Complete 🎙️
        </h1>
        <p className="font-body text-base text-text-primary">
          {formatDate(session.startedAt)} · {categoryLabel} · {session.sessionQuestionCount}{' '}
          question{session.sessionQuestionCount !== 1 ? 's' : ''} ·{' '}
          {estimateDurationMinutes(session.exchanges)} minutes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-surface rounded-xl shadow-card p-4 text-center">
          <p className="font-body text-sm text-text-muted mb-1">Overall Score</p>
          <p className="font-display font-bold text-3xl text-brand">
            {Math.round(session.overallScore ?? 0)}/100
          </p>
        </div>
        <div className="bg-bg-surface rounded-xl shadow-card p-4 text-center">
          <p className="font-body text-sm text-text-muted mb-1">Content</p>
          <p className="font-display font-bold text-2xl text-text-primary">
            {Math.round(session.contentScore ?? 0)}
          </p>
        </div>
        <div className="bg-bg-surface rounded-xl shadow-card p-4 text-center">
          <p className="font-body text-sm text-text-muted mb-1">Communication</p>
          <p className="font-display font-bold text-2xl text-text-primary">
            {Math.round(session.communicationScore ?? 0)}
          </p>
        </div>
      </div>

      {session.aiFeedback && (
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">AI Feedback</h2>
          <div className="bg-bg-surface rounded-xl shadow-card p-6 border-l-4 border-brand">
            <PlaybookFormattedText
              text={session.aiFeedback}
              className="font-body text-base text-text-primary"
            />
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-display font-semibold text-lg text-text-primary">
          Per-Answer Breakdown
        </h2>

        {session.exchanges.map((exchange, idx) => {
          const resources = getResourcesForExchange(exchange);
          const typeLabel =
            exchange.questionType === 'opening'
              ? 'Q'
              : exchange.questionType === 'challenge'
                ? 'Challenge'
                : 'Follow-up';

          return (
            <div
              key={exchange.id ?? idx}
              className="bg-bg-surface rounded-xl shadow-card p-4 space-y-3"
            >
              <div className="space-y-1">
                <p className="font-body text-sm text-text-muted">
                  {typeLabel}: &ldquo;{exchange.questionText.slice(0, 80)}
                  {exchange.questionText.length > 80 ? '…' : ''}&rdquo;
                </p>
                <div className="flex flex-wrap gap-4 font-body text-sm text-text-primary">
                  <span>Content: {Math.round(exchange.aiContentScore ?? 0)}/100</span>
                  {exchange.fillerWordCount != null && (
                    <span>● {exchange.fillerWordCount} filler words</span>
                  )}
                  {exchange.wordsPerMinute != null && (
                    <span>{Math.round(exchange.wordsPerMinute)} wpm</span>
                  )}
                </div>
              </div>

              {exchange.answerAudioUrl && (
                <AudioPlayer
                  audioUrl={exchange.answerAudioUrl}
                  label="Your answer"
                  fillerWordCount={exchange.fillerWordCount}
                  wordsPerMinute={exchange.wordsPerMinute}
                  durationSeconds={exchange.answerDurationSec ?? undefined}
                />
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedExchange(expandedExchange === idx ? null : idx)}
                  className="font-body text-sm text-brand hover:underline"
                >
                  {expandedExchange === idx ? 'Hide details' : 'Read transcript & feedback'}
                </button>
              </div>

              {expandedExchange === idx && (
                <div className="space-y-3 pt-2 border-t border-border-subtle">
                  {exchange.answerTranscript && (
                    <div className="p-3 bg-bg-subtle rounded-md">
                      <p className="font-body text-xs font-semibold text-text-muted uppercase mb-1">
                        Transcript
                      </p>
                      <p className="font-body text-base text-text-primary">
                        {exchange.answerTranscript}
                      </p>
                    </div>
                  )}
                  {exchange.aiContentFeedback && (
                    <div className="p-3 bg-bg-subtle rounded-md">
                      <p className="font-body text-xs font-semibold text-text-muted uppercase mb-1">
                        Feedback
                      </p>
                      <p className="font-body text-base text-text-primary">
                        {exchange.aiContentFeedback}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(resources.lessons.length > 0 || resources.external.length > 0) && (
                <div className="bg-warning-light border-l-4 border-warning rounded-r-md p-3 space-y-2">
                  <p className="font-body text-sm font-semibold text-text-primary">
                    This answer had gaps — review these resources:
                  </p>
                  <ul className="space-y-1">
                    {resources.lessons.map((lessonId) => (
                      <li key={lessonId}>
                        <Link
                          href={`/lessons/${lessonId}`}
                          className="font-body text-sm text-brand hover:underline"
                        >
                          → Lesson: {lessonId}
                        </Link>
                      </li>
                    ))}
                    {resources.external.map((r) => (
                      <li key={r.url}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm text-brand hover:underline"
                        >
                          → {r.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div className="flex flex-wrap gap-3">
        {primaryQuestionId && (
          <>
            <Button
              disabled={practicing}
              onClick={async () => {
                setPracticing(true);
                try {
                  await onPracticeAgain(primaryQuestionId);
                } finally {
                  setPracticing(false);
                }
              }}
            >
              🔁 Practice Again
            </Button>
            <Button variant="secondary" onClick={handleAddToReview} disabled={reviewQueued}>
              {reviewQueued ? '✓ Added to Review Queue' : '📅 Add to Review Queue'}
            </Button>
          </>
        )}
        <Link href="/simulator/voice/history">
          <Button variant="ghost">View History</Button>
        </Link>
        <Link href="/simulator/voice">
          <Button variant="ghost">Start New Interview</Button>
        </Link>
      </div>
    </div>
  );
}
