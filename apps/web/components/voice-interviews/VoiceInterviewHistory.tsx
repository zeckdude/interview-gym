'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Spinner } from '@/components/ui/Spinner';
import { AudioPlayer } from '@/components/systems-design/AudioPlayer';
import { PlaybookFormattedText } from '@/components/playbook/PlaybookFormattedText';
import { getCategoryLabel, getVoiceQuestionById } from '@/data/voice-interviews';

interface Exchange {
  id: string;
  questionId?: string | null;
  order: number;
  questionText: string;
  questionType: string;
  answerTranscript?: string | null;
  answerAudioUrl?: string | null;
  answerDurationSec?: number | null;
  fillerWordCount?: number | null;
  wordsPerMinute?: number | null;
  aiContentScore?: number | null;
  aiContentFeedback?: string | null;
  aiGaps?: string[] | null;
}

interface SessionSummary {
  id: string;
  category: string;
  difficulty: string;
  sessionQuestionCount: number;
  startedAt: string;
  completedAt: string | null;
  overallScore: number | null;
  aiFeedback: string | null;
  exchanges: Exchange[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function VoiceInterviewHistory() {
  const { data, error, isLoading } = useSWR<{ sessions: SessionSummary[] }>(
    '/api/voice-interviews/sessions',
    fetcher
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedExchange, setExpandedExchange] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="font-body text-base text-error">Failed to load history.</p>
    );
  }

  const sessions = data?.sessions ?? [];

  if (sessions.length === 0) {
    return (
      <div className="space-y-4 max-w-2xl">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Voice Interview History
        </h1>
        <div className="bg-bg-surface rounded-xl shadow-card p-6">
          <p className="font-body text-base text-text-primary">
            No voice interviews yet.{' '}
            <Link href="/simulator/voice" className="text-brand hover:underline">
              Start your first one →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Voice Interview History
        </h1>
        <Link
          href="/simulator/voice"
          className="font-body text-sm text-brand hover:underline"
        >
          Start new interview →
        </Link>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const isExpanded = expandedId === session.id;
          const categoryLabel =
            session.category === 'mixed'
              ? 'Mixed'
              : getCategoryLabel(session.category as Parameters<typeof getCategoryLabel>[0]);

          return (
            <div key={session.id} className="bg-bg-surface rounded-xl shadow-card overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                className="w-full text-left p-4 hover:bg-bg-subtle transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-base text-text-primary font-semibold">
                      {formatDate(session.startedAt)} · {categoryLabel} ·{' '}
                      {session.sessionQuestionCount} question
                      {session.sessionQuestionCount !== 1 ? 's' : ''}
                      {session.overallScore != null && (
                        <span className="text-brand"> · {Math.round(session.overallScore)}/100</span>
                      )}
                    </p>
                  </div>
                  <span className="font-body text-sm text-text-muted">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-border-subtle pt-4">
                  {session.exchanges.map((exchange) => {
                    const exchangeKey = `${session.id}-${exchange.id}`;
                    const showDetails = expandedExchange === exchangeKey;
                    const qId = exchange.questionId ?? undefined;
                    const question = qId ? getVoiceQuestionById(qId) : undefined;
                    const hasGaps =
                      (exchange.aiGaps?.length ?? 0) > 0 ||
                      (exchange.aiContentScore ?? 100) < 70;

                    return (
                      <div
                        key={exchange.id}
                        className="pl-4 border-l-2 border-border-subtle space-y-2"
                      >
                        <p className="font-body text-sm text-text-primary">
                          {exchange.questionType === 'opening' ? 'Q' : exchange.questionType}:{' '}
                          &ldquo;{exchange.questionText.slice(0, 70)}
                          {exchange.questionText.length > 70 ? '…' : ''}&rdquo;
                        </p>
                        <p className="font-body text-sm text-text-muted">
                          Content: {Math.round(exchange.aiContentScore ?? 0)}
                          {exchange.fillerWordCount != null &&
                            ` · ${exchange.fillerWordCount} fillers`}
                          {exchange.wordsPerMinute != null &&
                            ` · ${Math.round(exchange.wordsPerMinute)}wpm`}
                        </p>

                        {exchange.answerAudioUrl && (
                          <AudioPlayer
                            audioUrl={exchange.answerAudioUrl}
                            label="Answer"
                            fillerWordCount={exchange.fillerWordCount}
                            wordsPerMinute={exchange.wordsPerMinute}
                            durationSeconds={exchange.answerDurationSec ?? undefined}
                          />
                        )}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedExchange(showDetails ? null : exchangeKey)
                            }
                            className="font-body text-sm text-brand hover:underline"
                          >
                            {showDetails ? 'Hide' : 'Transcript & Feedback'}
                          </button>
                          <Link
                            href={`/simulator/voice/${session.id}`}
                            className="font-body text-sm text-brand hover:underline"
                          >
                            View session
                          </Link>
                        </div>

                        {showDetails && (
                          <div className="space-y-2 p-3 bg-bg-subtle rounded-md">
                            {exchange.answerTranscript && (
                              <p className="font-body text-base text-text-primary">
                                {exchange.answerTranscript}
                              </p>
                            )}
                            {exchange.aiContentFeedback && (
                              <p className="font-body text-sm text-text-primary italic">
                                {exchange.aiContentFeedback}
                              </p>
                            )}
                          </div>
                        )}

                        {hasGaps && question && question.externalResources.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-body text-xs text-text-muted">📚 Resources:</p>
                            {question.externalResources.map((r) => (
                              <a
                                key={r.url}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block font-body text-sm text-brand hover:underline"
                              >
                                {r.label} →
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {session.aiFeedback && (
                    <div className="p-4 bg-bg-subtle rounded-md space-y-2">
                      <p className="font-body text-xs font-semibold text-text-muted uppercase">
                        AI Debrief
                      </p>
                      <PlaybookFormattedText
                        text={session.aiFeedback}
                        className="font-body text-base text-text-primary"
                      />
                    </div>
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
