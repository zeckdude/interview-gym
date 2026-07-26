'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Spinner } from '@/components/ui/Spinner';
import { AudioPlayer } from '@/components/systems-design/AudioPlayer';
import type { SystemDesignDialogMessage } from '@/data/types';
import { getSystemDesignChallengeById } from '@/data/system-design';
import { cn } from '@/lib/utils';

interface HistoryAnswer {
  id: string;
  section: string;
  questionText: string;
  textContent: string | null;
  audioUrl: string | null;
  transcript: string | null;
  fillerWordCount: number | null;
  wordsPerMinute: number | null;
  confidenceScore: number | null;
  createdAt: string;
}

interface HistorySession {
  id: string;
  challengeId: string;
  challengeTitle: string;
  startedAt: string;
  completedAt: string | null;
  overallScore: number | null;
  sectionScores: Record<string, number> | null;
  aiFeedback: string | null;
  dialogHistory: SystemDesignDialogMessage[] | null;
  answers: HistoryAnswer[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SystemDesignHistory() {
  const { data, isLoading, error } = useSWR<{ sessions: HistorySession[] }>(
    '/api/systems-design/sessions',
    fetcher
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="font-body text-base text-error bg-error-light rounded-md p-4">
        Could not load history. Sign in to view your sessions.
      </p>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/systems-design"
          className="font-body text-sm text-brand hover:text-brand-dark font-semibold"
        >
          ← Back to Systems Design
        </Link>
        <h1 className="font-display font-bold text-3xl text-text-primary">Session History</h1>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-8 text-center space-y-3">
          <p className="font-body text-base text-text-primary">No sessions yet.</p>
          <Link
            href="/systems-design"
            className="inline-block bg-brand text-white px-5 py-2.5 rounded-md font-body text-sm font-semibold hover:bg-brand-dark"
          >
            Start a challenge
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const expanded = expandedId === session.id;
            const challenge = getSystemDesignChallengeById(session.challengeId);
            const sectionScores = session.sectionScores ?? {};

            return (
              <div
                key={session.id}
                className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : session.id)}
                  className="w-full text-left p-5 hover:bg-bg-subtle/50 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="font-display font-semibold text-lg text-text-primary">
                        {session.challengeTitle}
                      </h2>
                      <p className="font-body text-sm text-text-muted">
                        {new Date(session.startedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                        {session.completedAt ? ' · Completed' : ' · In progress'}
                      </p>
                    </div>
                    {session.overallScore != null && (
                      <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm bg-brand-light text-brand">
                        {Math.round(session.overallScore)}/100
                      </span>
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-border-subtle p-5 space-y-6">
                    {Object.keys(sectionScores).length > 0 && (
                      <section className="space-y-3">
                        <h3 className="font-body font-semibold text-base text-text-primary">
                          Section scores
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(sectionScores).map(([id, score]) => {
                            const label =
                              challenge?.sections.find((s) => s.id === id)?.label ?? id;
                            return (
                              <span
                                key={id}
                                className="bg-bg-subtle rounded-md px-3 py-1.5 font-body text-sm text-text-primary"
                              >
                                {label}: <strong>{Math.round(score)}</strong>
                              </span>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    <section className="space-y-3">
                      <h3 className="font-body font-semibold text-base text-text-primary">
                        Your design
                      </h3>
                      <div className="space-y-4">
                        {session.answers
                          .filter((a) => a.section !== 'followup')
                          .map((answer) => {
                            const section = challenge?.sections.find(
                              (s) => s.id === answer.section
                            );
                            return (
                              <div
                                key={answer.id}
                                className="bg-bg-subtle rounded-lg p-4 space-y-2"
                              >
                                <p className="font-body text-sm font-semibold text-text-primary">
                                  {section?.label ?? answer.section}
                                </p>
                                <p className="font-body text-sm text-text-primary whitespace-pre-wrap">
                                  {answer.textContent ?? answer.transcript}
                                </p>
                                {answer.audioUrl && (
                                  <AudioPlayer
                                    audioUrl={answer.audioUrl}
                                    fillerWordCount={answer.fillerWordCount}
                                    wordsPerMinute={answer.wordsPerMinute}
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </section>

                    {session.dialogHistory && session.dialogHistory.length > 0 && (
                      <section className="space-y-3">
                        <h3 className="font-body font-semibold text-base text-text-primary">
                          Follow-up dialog
                        </h3>
                        <div className="space-y-3">
                          {session.dialogHistory.map((msg, i) => (
                            <div
                              key={i}
                              className={cn(
                                'rounded-md p-3',
                                msg.role === 'assistant' ? 'bg-brand-light' : 'bg-bg-subtle ml-4'
                              )}
                            >
                              <p className="font-body text-xs font-semibold text-text-muted mb-1">
                                {msg.role === 'assistant' ? 'Interviewer' : 'You'}
                              </p>
                              <p className="font-body text-sm text-text-primary whitespace-pre-wrap">
                                {msg.content}
                              </p>
                              {msg.audioClipUrl && (
                                <div className="mt-2">
                                  <AudioPlayer
                                    audioUrl={msg.audioClipUrl}
                                    fillerWordCount={msg.fillerWordCount}
                                    wordsPerMinute={msg.wordsPerMinute}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {session.aiFeedback && (
                      <section className="bg-brand-light border-l-4 border-brand rounded-r-lg p-4">
                        <h3 className="font-body font-semibold text-base text-text-primary mb-2">
                          AI feedback
                        </h3>
                        <p className="font-body text-sm text-text-primary whitespace-pre-wrap">
                          {session.aiFeedback}
                        </p>
                      </section>
                    )}

                    {challenge && challenge.externalResources.length > 0 && (
                      <section className="space-y-2">
                        <h3 className="font-body font-semibold text-base text-text-primary">
                          Resources
                        </h3>
                        <ul className="space-y-1">
                          {challenge.externalResources.map((r) => (
                            <li key={r.url}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body text-sm text-brand hover:text-brand-dark font-semibold"
                              >
                                {r.label} ↗
                              </a>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
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
