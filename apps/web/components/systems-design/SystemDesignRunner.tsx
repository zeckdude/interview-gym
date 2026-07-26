'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { AudioPlayer } from '@/components/systems-design/AudioPlayer';
import { VoiceRecorder, blobToDataUrl } from '@/components/systems-design/VoiceRecorder';
import type {
  SystemDesignChallenge,
  SystemDesignDialogMessage,
  SystemDesignSectionGrade,
} from '@/data/types';
import { cn } from '@/lib/utils';

type Phase = 'design' | 'grading' | 'dialog' | 'complete';
type InputMode = 'text' | 'speak';

interface SectionAnswerState {
  text: string;
  audioBlob?: Blob;
  audioDataUrl?: string;
  transcript?: string;
  analytics?: {
    fillerWordCount: number;
    wordsPerMinute: number;
    confidenceScore: number;
    durationSeconds: number;
  };
}

interface SystemDesignRunnerProps {
  challenge: SystemDesignChallenge;
}

export function SystemDesignRunner({ challenge }: SystemDesignRunnerProps) {
  const [phase, setPhase] = useState<Phase>('design');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sectionAnswers, setSectionAnswers] = useState<Record<string, SectionAnswerState>>({});
  const [inputModes, setInputModes] = useState<Record<string, InputMode>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectionGrades, setSectionGrades] = useState<SystemDesignSectionGrade[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [dialogHistory, setDialogHistory] = useState<SystemDesignDialogMessage[]>([]);
  const [dialogInput, setDialogInput] = useState('');
  const [dialogInputMode, setDialogInputMode] = useState<InputMode>('text');
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogAudio, setDialogAudio] = useState<SectionAnswerState | null>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);

  const sectionScores = useMemo(() => {
    const scores: Record<string, number> = {};
    for (const g of sectionGrades) scores[g.sectionId] = g.score;
    return scores;
  }, [sectionGrades]);

  const sectionSummaries = useMemo(() => {
    return challenge.sections
      .map((s) => `${s.label}: ${sectionAnswers[s.id]?.text?.slice(0, 400) ?? '(empty)'}`)
      .join('\n\n');
  }, [challenge.sections, sectionAnswers]);

  const getInputMode = (sectionId: string): InputMode => inputModes[sectionId] ?? 'text';

  const setSectionAnswer = (sectionId: string, text: string) => {
    setSectionAnswers((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], text },
    }));
  };

  const handleVoiceReady = async (
    sectionId: string,
    transcript: string,
    audioBlob: Blob,
    analytics: {
      fillerWordCount: number;
      wordsPerMinute: number;
      confidenceScore: number;
      durationSeconds: number;
    }
  ) => {
    const audioDataUrl = await blobToDataUrl(audioBlob);
    setSectionAnswers((prev) => ({
      ...prev,
      [sectionId]: {
        text: transcript,
        audioBlob,
        audioDataUrl,
        transcript,
        analytics,
      },
    }));
  };

  const allSectionsFilled = challenge.sections.every(
    (s) => (sectionAnswers[s.id]?.text?.trim().length ?? 0) > 0
  );

  const createSession = async () => {
    const res = await fetch('/api/systems-design/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: challenge.id }),
    });
    const data = (await res.json()) as { sessionId?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? 'Failed to create session');
    return data.sessionId!;
  };

  const gradeSections = async (): Promise<SystemDesignSectionGrade[]> => {
    const grades = await Promise.all(
      challenge.sections.map(async (section) => {
        const answer = sectionAnswers[section.id]?.text ?? '';
        const res = await fetch('/api/ai/grade-system-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: challenge.id,
            sectionId: section.id,
            sectionAnswer: answer,
          }),
        });
        const data = (await res.json()) as SystemDesignSectionGrade & { error?: string };
        if (!res.ok) throw new Error(data.error ?? `Failed to grade ${section.label}`);
        return data;
      })
    );
    return grades;
  };

  const handleSubmitDesign = async () => {
    if (!allSectionsFilled) {
      setError('Fill in every section before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setPhase('grading');

    try {
      const sid = sessionId ?? (await createSession());
      if (!sessionId) setSessionId(sid);

      const grades = await gradeSections();
      setSectionGrades(grades);

      const overall =
        grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
      setOverallScore(Math.round(overall));

      const answersPayload = challenge.sections.map((s) => {
        const a = sectionAnswers[s.id];
        return {
          sectionId: s.id,
          textContent: a.text,
          audioDataUrl: a.audioDataUrl,
          transcript: a.transcript,
          analytics: a.analytics
            ? {
                fillerWordCount: a.analytics.fillerWordCount,
                wordsPerMinute: a.analytics.wordsPerMinute,
                confidenceScore: a.analytics.confidenceScore,
              }
            : undefined,
        };
      });

      const res = await fetch(`/api/systems-design/sessions/${sid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          answers: answersPayload,
          sectionGrades: grades.map((g) => ({
            sectionId: g.sectionId,
            score: g.score,
            feedback: g.feedback,
            strengths: g.strengths,
            gaps: g.gaps,
          })),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to save session');
      }

      setPhase('dialog');
      await startDialog(sid, grades);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setPhase('design');
    } finally {
      setSubmitting(false);
    }
  };

  const startDialog = async (sid: string, grades: SystemDesignSectionGrade[]) => {
    setDialogLoading(true);
    try {
      const scores: Record<string, number> = {};
      for (const g of grades) scores[g.sectionId] = g.score;

      const res = await fetch('/api/ai/system-design-dialog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          sectionSummaries,
          sectionScores: scores,
          dialogHistory: [],
          exchangeCount: 0,
        }),
      });

      const data = (await res.json()) as { message?: string; wrappedUp?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Dialog failed');

      const assistantMsg: SystemDesignDialogMessage = {
        role: 'assistant',
        content: data.message ?? '',
      };
      setDialogHistory([assistantMsg]);

      if (data.wrappedUp) {
        setFinalFeedback(data.message ?? null);
        setPhase('complete');
        await completeSession(sid, [assistantMsg], data.message ?? '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dialog failed');
    } finally {
      setDialogLoading(false);
    }
  };

  const completeSession = async (
    sid: string,
    history: SystemDesignDialogMessage[],
    feedback: string
  ) => {
    await fetch(`/api/systems-design/sessions/${sid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'dialog',
        dialogHistory: history,
        aiFeedback: feedback,
        completed: true,
      }),
    });
  };

  const sendDialogReply = async () => {
    const text = dialogInput.trim() || dialogAudio?.text?.trim();
    if (!text || !sessionId) return;

    setDialogLoading(true);
    setError(null);

    const capturedAudio = dialogAudio;

    const userMsg: SystemDesignDialogMessage = {
      role: 'user',
      content: text,
      audioClipUrl: capturedAudio?.audioDataUrl,
      transcript: capturedAudio?.transcript,
      fillerWordCount: capturedAudio?.analytics?.fillerWordCount,
      wordsPerMinute: capturedAudio?.analytics?.wordsPerMinute,
      confidenceScore: capturedAudio?.analytics?.confidenceScore,
    };

    const newHistory = [...dialogHistory, userMsg];
    const newExchangeCount = exchangeCount + 1;
    setDialogHistory(newHistory);
    setDialogInput('');
    setDialogAudio(null);
    setExchangeCount(newExchangeCount);

    const followUpPayload = {
      sectionId: 'followup',
      textContent: text,
      audioDataUrl: userMsg.audioClipUrl,
      transcript: userMsg.transcript,
      analytics: capturedAudio?.analytics
        ? {
            fillerWordCount: capturedAudio.analytics.fillerWordCount,
            wordsPerMinute: capturedAudio.analytics.wordsPerMinute,
            confidenceScore: capturedAudio.analytics.confidenceScore,
          }
        : undefined,
    };

    try {
      const res = await fetch('/api/ai/system-design-dialog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          sectionSummaries,
          sectionScores,
          dialogHistory: newHistory,
          exchangeCount: newExchangeCount,
        }),
      });

      const data = (await res.json()) as { message?: string; wrappedUp?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Dialog failed');

      const assistantMsg: SystemDesignDialogMessage = {
        role: 'assistant',
        content: data.message ?? '',
      };
      const fullHistory = [...newHistory, assistantMsg];
      setDialogHistory(fullHistory);

      if (data.wrappedUp) {
        setFinalFeedback(data.message ?? null);
        setPhase('complete');
        await fetch(`/api/systems-design/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'dialog',
            dialogHistory: fullHistory,
            followUpAnswer: followUpPayload,
            aiFeedback: data.message,
            completed: true,
          }),
        });
      } else {
        await fetch(`/api/systems-design/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'dialog',
            dialogHistory: fullHistory,
            followUpAnswer: followUpPayload,
          }),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDialogVoice = useCallback(
    async (
      transcript: string,
      audioBlob: Blob,
      analytics: {
        fillerWordCount: number;
        wordsPerMinute: number;
        confidenceScore: number;
        durationSeconds: number;
      }
    ) => {
      const audioDataUrl = await blobToDataUrl(audioBlob);
      setDialogAudio({
        text: transcript,
        audioBlob,
        audioDataUrl,
        transcript,
        analytics,
      });
      setDialogInput(transcript);
    },
    []
  );

  if (phase === 'grading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Spinner size="lg" />
        <p className="font-body text-base text-text-primary font-semibold">
          Grading your design…
        </p>
        <p className="font-body text-sm text-text-muted">
          Each section is scored independently by AI
        </p>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-success-light border-l-4 border-success rounded-r-lg p-6 space-y-2">
          <h2 className="font-display font-bold text-2xl text-text-primary">Design Complete</h2>
          {overallScore != null && (
            <p className="font-body text-lg text-text-primary">
              Overall score: <strong>{overallScore}/100</strong>
            </p>
          )}
        </div>

        {sectionGrades.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-display font-semibold text-xl text-text-primary">
              Section Scores
            </h3>
            <div className="grid gap-4">
              {sectionGrades.map((grade) => {
                const section = challenge.sections.find((s) => s.id === grade.sectionId);
                return (
                  <div
                    key={grade.sectionId}
                    className="bg-bg-surface border border-border-subtle rounded-lg p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-body font-semibold text-base text-text-primary">
                        {section?.label ?? grade.sectionId}
                      </h4>
                      <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm bg-brand-light text-brand">
                        {grade.score}/100
                      </span>
                    </div>
                    <p className="font-body text-base text-text-primary">{grade.feedback}</p>
                    {grade.strengths.length > 0 && (
                      <div className="bg-success-light/50 rounded-md p-3">
                        <p className="font-body text-xs font-semibold text-text-primary mb-1">
                          Strengths
                        </p>
                        <ul className="space-y-1">
                          {grade.strengths.map((s) => (
                            <li key={s} className="font-body text-sm text-text-primary">
                              ✓ {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {grade.gaps.length > 0 && (
                      <div className="bg-warning-light/50 rounded-md p-3">
                        <p className="font-body text-xs font-semibold text-text-primary mb-1">
                          Gaps
                        </p>
                        <ul className="space-y-1">
                          {grade.gaps.map((g) => (
                            <li key={g} className="font-body text-sm text-text-primary">
                              → {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {challenge.sampleAnswer[grade.sectionId] && (
                      <details className="bg-bg-subtle rounded-md p-3">
                        <summary className="font-body text-sm font-semibold text-text-primary cursor-pointer">
                          Reference answer
                        </summary>
                        <p className="font-body text-sm text-text-primary mt-2 leading-relaxed">
                          {challenge.sampleAnswer[grade.sectionId]}
                        </p>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {finalFeedback && (
          <section className="bg-brand-light border-l-4 border-brand rounded-r-lg p-6 space-y-2">
            <h3 className="font-display font-semibold text-lg text-text-primary">
              Interview Summary
            </h3>
            <p className="font-body text-base text-text-primary leading-relaxed whitespace-pre-wrap">
              {finalFeedback}
            </p>
          </section>
        )}

        {(challenge.relatedLessonIds.length > 0 || challenge.externalResources.length > 0) && (
          <section className="space-y-4">
            <h3 className="font-display font-semibold text-xl text-text-primary">
              Keep Learning
            </h3>
            {challenge.relatedLessonIds.length > 0 && (
              <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 space-y-2">
                <p className="font-body text-sm font-semibold text-text-primary">
                  Related lessons
                </p>
                <ul className="space-y-2">
                  {challenge.relatedLessonIds.map((id) => (
                    <li key={id}>
                      <Link
                        href={`/lessons/${id}`}
                        className="font-body text-sm text-brand hover:text-brand-dark font-semibold"
                      >
                        {id.replace(/^lesson-/, '').replace(/-/g, ' ')} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {challenge.externalResources.length > 0 && (
              <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 space-y-2">
                <p className="font-body text-sm font-semibold text-text-primary">
                  External resources
                </p>
                <ul className="space-y-2">
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
              </div>
            )}
          </section>
        )}

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/systems-design/history"
            className="bg-brand text-white px-5 py-2.5 rounded-md font-body text-sm font-semibold hover:bg-brand-dark"
          >
            View History
          </Link>
          <Link
            href="/systems-design"
            className="bg-bg-surface border border-border-subtle px-5 py-2.5 rounded-md font-body text-sm font-semibold text-text-primary hover:border-brand/40"
          >
            More Challenges
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'dialog') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 space-y-2">
          <h2 className="font-display font-bold text-xl text-text-primary">
            Design Review: {challenge.title}
          </h2>
          {overallScore != null && (
            <p className="font-body text-base text-text-primary">
              Overall score: <strong>{overallScore}/100</strong>
            </p>
          )}
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {dialogHistory.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg p-4',
                msg.role === 'assistant'
                  ? 'bg-brand-light border-l-4 border-brand'
                  : 'bg-bg-subtle border-l-4 border-border-subtle ml-8'
              )}
            >
              <p className="font-body text-xs font-semibold text-text-muted uppercase mb-1">
                {msg.role === 'assistant' ? 'Interviewer' : 'You'}
              </p>
              <p className="font-body text-base text-text-primary leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              {msg.audioClipUrl && (
                <div className="mt-3">
                  <AudioPlayer
                    audioUrl={msg.audioClipUrl}
                    fillerWordCount={msg.fillerWordCount}
                    wordsPerMinute={msg.wordsPerMinute}
                  />
                </div>
              )}
            </div>
          ))}
          {dialogLoading && (
            <div className="flex items-center gap-2 py-2">
              <Spinner size="sm" />
              <span className="font-body text-sm text-text-muted">Interviewer is thinking…</span>
            </div>
          )}
        </div>

        {error && (
          <p className="font-body text-sm text-error bg-error-light rounded-md px-3 py-2">{error}</p>
        )}

        <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-1 bg-bg-subtle rounded-full p-0.5 w-fit ml-auto">
            <button
              type="button"
              onClick={() => setDialogInputMode('text')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-body font-semibold transition-all',
                dialogInputMode === 'text' ? 'bg-brand text-white' : 'text-text-secondary'
              )}
            >
              ✏️ Type
            </button>
            <button
              type="button"
              onClick={() => setDialogInputMode('speak')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-body font-semibold transition-all',
                dialogInputMode === 'speak' ? 'bg-brand text-white' : 'text-text-secondary'
              )}
            >
              🎙️ Speak
            </button>
          </div>

          {dialogInputMode === 'text' ? (
            <textarea
              value={dialogInput}
              onChange={(e) => setDialogInput(e.target.value)}
              placeholder="Your response…"
              rows={4}
              className="w-full bg-bg-subtle border border-border-subtle rounded-md px-4 py-3 font-body text-base text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-brand"
            />
          ) : (
            <VoiceRecorder
              sectionId="dialog"
              spokenPrompt="Answer the interviewer's question clearly and concisely."
              onTranscriptReady={handleDialogVoice}
            />
          )}

          <button
            type="button"
            onClick={sendDialogReply}
            disabled={dialogLoading || (!dialogInput.trim() && !dialogAudio?.text)}
            className="bg-brand text-white px-5 py-2.5 rounded-md font-body text-sm font-semibold hover:bg-brand-dark disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Scenario */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge type="difficulty" value={challenge.difficulty} />
          {challenge.mostAsked && (
            <span className="bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full">
              🔥 Most Asked
            </span>
          )}
          <span className="font-body text-sm text-text-muted">
            ⏱️ ~{challenge.estimatedMinutes} min
          </span>
        </div>

        <section className="bg-bg-surface border border-border-subtle rounded-lg p-5 space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">Scenario</h2>
          <div className="prose prose-sm max-w-none font-body text-base text-text-primary [&_p]:text-text-primary [&_li]:text-text-primary">
            <ReactMarkdown>{challenge.scenario}</ReactMarkdown>
          </div>
        </section>

        <section className="bg-warning-light border-l-4 border-warning rounded-r-lg p-5 space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">Constraints</h2>
          <ul className="space-y-2">
            {challenge.constraints.map((c) => (
              <li key={c} className="font-body text-base text-text-primary flex gap-2">
                <span className="text-warning font-bold">•</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Right: Design form */}
      <div className="lg:col-span-3 space-y-6">
        <h2 className="font-display font-bold text-xl text-text-primary">Your Design</h2>

        {challenge.sections.map((section) => {
          const mode = getInputMode(section.id);
          return (
            <section
              key={section.id}
              className="bg-bg-surface border border-border-subtle rounded-lg p-5 space-y-3"
            >
              <div className="flex items-start gap-2 flex-wrap">
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-body text-base font-semibold text-text-primary">
                    {section.label}
                  </h3>
                  <p className="font-body text-sm text-text-primary">{section.prompt}</p>
                </div>
                <div className="flex items-center gap-1 bg-bg-subtle rounded-full p-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setInputModes((prev) => ({ ...prev, [section.id]: 'text' }))
                    }
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-body font-semibold transition-all',
                      mode === 'text' ? 'bg-brand text-white' : 'text-text-secondary'
                    )}
                  >
                    ✏️ Type
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInputModes((prev) => ({ ...prev, [section.id]: 'speak' }))
                    }
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-body font-semibold transition-all',
                      mode === 'speak' ? 'bg-brand text-white' : 'text-text-secondary'
                    )}
                  >
                    🎙️ Speak
                  </button>
                </div>
              </div>

              {mode === 'text' ? (
                <textarea
                  value={sectionAnswers[section.id]?.text ?? ''}
                  onChange={(e) => setSectionAnswer(section.id, e.target.value)}
                  placeholder={section.placeholder}
                  rows={6}
                  className="w-full bg-bg-subtle border border-border-subtle rounded-md px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-brand"
                />
              ) : (
                <VoiceRecorder
                  sectionId={section.id}
                  spokenPrompt={section.spokenPrompt}
                  onTranscriptReady={(transcript, blob, analytics) =>
                    void handleVoiceReady(section.id, transcript, blob, analytics)
                  }
                />
              )}

              {sectionAnswers[section.id]?.audioDataUrl && mode === 'speak' && (
                <AudioPlayer
                  audioUrl={sectionAnswers[section.id].audioDataUrl!}
                  fillerWordCount={sectionAnswers[section.id].analytics?.fillerWordCount}
                  wordsPerMinute={sectionAnswers[section.id].analytics?.wordsPerMinute}
                  durationSeconds={sectionAnswers[section.id].analytics?.durationSeconds}
                />
              )}
            </section>
          );
        })}

        {error && (
          <p className="font-body text-sm text-error bg-error-light rounded-md px-4 py-3">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmitDesign}
          disabled={submitting || !allSectionsFilled}
          className="w-full bg-brand text-white py-3 rounded-md font-body text-base font-semibold hover:bg-brand-dark disabled:opacity-50 transition-all"
        >
          {submitting ? 'Submitting…' : 'Submit Design'}
        </button>
      </div>
    </div>
  );
}
