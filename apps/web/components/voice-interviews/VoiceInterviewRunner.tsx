'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import {
  VoiceInterviewRecorder,
  blobToBase64,
  type TranscriptionResult,
} from '@/components/voice-interviews/VoiceInterviewRecorder';
import { VoiceInterviewResults } from '@/components/voice-interviews/VoiceInterviewResults';
import {
  getCategoryLabel,
  getVoiceQuestionById,
  type VoiceInterviewQuestion,
} from '@/data/voice-interviews';
import { isSpeechSynthesisSupported, speakQuestion } from '@/lib/speak-question';
import type { ExchangeType } from '@/lib/voice-interview-engine';

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
  includeFollowUps: boolean;
  startedAt: string;
  completedAt: string | null;
  overallScore: number | null;
  contentScore: number | null;
  communicationScore: number | null;
  aiFeedback: string | null;
  exchanges: Exchange[];
}

interface PendingQuestion {
  text: string;
  type: ExchangeType;
  questionId?: string;
}

const MAX_FOLLOWUPS = 2;

export function VoiceInterviewRunner({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<VoiceInterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [pendingQuestion, setPendingQuestion] = useState<PendingQuestion | null>(null);
  const [transcript, setTranscript] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analytics, setAnalytics] = useState<Omit<TranscriptionResult, 'transcript'> | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'interview' | 'complete'>('interview');

  const loadSession = useCallback(async () => {
    const res = await fetch(`/api/voice-interviews/sessions/${sessionId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Failed to load session');
    setSession(data.session);
    setQuestions(data.questions ?? []);
    if (data.session.completedAt) {
      setPhase('complete');
    }
    return data as { session: SessionData; questions: VoiceInterviewQuestion[] };
  }, [sessionId]);

  useEffect(() => {
    loadSession()
      .then((data) => {
        if (data.session.completedAt) return;

        const exchanges = data.session.exchanges;
        const openings = exchanges.filter((e) => e.questionType === 'opening');
        const qIndex = openings.length;

        if (qIndex >= data.session.questionIds.length) {
          setPhase('complete');
          return;
        }

        const lastExchange = exchanges[exchanges.length - 1];
        if (!lastExchange || lastExchange.answerTranscript) {
          const question = data.questions[qIndex];
          if (question) {
            setCurrentQuestionIndex(qIndex);
            setFollowUpCount(0);
            setPendingQuestion({
              text: question.question,
              type: 'opening',
              questionId: question.id,
            });
          }
        } else {
          setPendingQuestion({
            text: lastExchange.questionText,
            type: lastExchange.questionType as ExchangeType,
            questionId: lastExchange.questionId ?? undefined,
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadSession]);

  const resetAnswerState = () => {
    setTranscript('');
    setTypedAnswer('');
    setAudioBlob(null);
    setAnalytics(null);
  };

  const handleTranscriptReady = (
    text: string,
    blob: Blob | null,
    stats: Omit<TranscriptionResult, 'transcript'> | null
  ) => {
    setTranscript(text);
    setTypedAnswer(text);
    setAudioBlob(blob);
    setAnalytics(stats);
  };

  const handleSpeakQuestion = () => {
    if (pendingQuestion) speakQuestion(pendingQuestion.text);
  };

  const getCurrentBankQuestion = (): VoiceInterviewQuestion | undefined => {
    const fromIndex = questions[currentQuestionIndex];
    const qId = session?.questionIds[currentQuestionIndex];
    if (!qId) return fromIndex;
    return getVoiceQuestionById(qId) ?? fromIndex;
  };

  const submitAnswer = async () => {
    if (!session || !pendingQuestion) return;
    const answerText = transcript || typedAnswer.trim();
    if (!answerText) {
      setError('Please record or type an answer before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const bankQuestion = getCurrentBankQuestion();
      let scoreData: {
        contentScore?: number;
        contentFeedback: string;
        gaps: string[];
        recommendedFollowUpType: 'followup' | 'challenge';
      } = {
        contentFeedback: 'Answer recorded (content not scored).',
        gaps: [],
        recommendedFollowUpType: 'followup',
      };

      if (bankQuestion) {
        const scoreRes = await fetch('/api/ai/score-voice-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: pendingQuestion.text,
            category: bankQuestion.category,
            transcript: answerText,
            idealAnswerGuidance: bankQuestion.idealAnswerGuidance,
            targetAnswerMinutes: bankQuestion.targetAnswerMinutes,
          }),
        });
        if (scoreRes.ok) {
          scoreData = await scoreRes.json();
        }
      }

      let audioBase64: string | undefined;
      if (audioBlob) {
        audioBase64 = await blobToBase64(audioBlob);
      }

      const saveRes = await fetch(`/api/voice-interviews/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-exchange',
          questionText: pendingQuestion.text,
          questionType: pendingQuestion.type,
          questionId: pendingQuestion.questionId,
          transcript: answerText,
          audioBase64,
          audioContentType: audioBlob?.type,
          fillerWordCount: analytics?.fillerWordCount,
          wordsPerMinute: analytics?.wordsPerMinute,
          confidenceScore: analytics?.confidenceScore,
          durationSeconds: analytics?.durationSeconds,
          aiContentScore: scoreData.contentScore ?? null,
          aiContentFeedback: scoreData.contentFeedback,
          aiGaps: scoreData.gaps,
        }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error ?? 'Failed to save answer');
      }

      const updated = await loadSession();
      resetAnswerState();

      const includeFollowUps = session.includeFollowUps;
      const isLastQuestion = currentQuestionIndex >= session.questionIds.length - 1;
      const canFollowUp =
        includeFollowUps &&
        pendingQuestion.type !== 'wrap' &&
        followUpCount < MAX_FOLLOWUPS &&
        bankQuestion;

      if (canFollowUp) {
        const previousQuestions = updated.session.exchanges.map((e) => e.questionText);
        const followUpRes = await fetch('/api/ai/select-voice-followup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            openingQuestion: bankQuestion!.question,
            latestTranscript: answerText,
            followUpBank: bankQuestion!.followUpBank,
            challengeQuestions: bankQuestion!.challengeQuestions,
            previousQuestions,
            recommendedFollowUpType: scoreData.recommendedFollowUpType,
          }),
        });

        if (followUpRes.ok) {
          const followUp = await followUpRes.json();
          setFollowUpCount((c) => c + 1);
          setPendingQuestion({
            text: followUp.question,
            type: followUp.type,
            questionId: bankQuestion!.id,
          });
          return;
        }
      }

      if (!isLastQuestion) {
        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = questions[nextIndex] ?? getVoiceQuestionById(session.questionIds[nextIndex]);
        setCurrentQuestionIndex(nextIndex);
        setFollowUpCount(0);
        if (nextQuestion) {
          setPendingQuestion({
            text: nextQuestion.question,
            type: 'opening',
            questionId: nextQuestion.id,
          });
        }
        return;
      }

      await finishSession(updated.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const finishSession = async (currentSession: SessionData) => {
    const answered = currentSession.exchanges.filter((e) => e.answerTranscript);
    const scoredAnswers = answered.filter((e) => e.aiContentScore != null);
    const avgContent =
      scoredAnswers.reduce((sum, e) => sum + (e.aiContentScore ?? 0), 0) /
      Math.max(1, scoredAnswers.length);
    const totalFillers = answered.reduce((sum, e) => sum + (e.fillerWordCount ?? 0), 0);
    const avgWPM =
      answered.reduce((sum, e) => sum + (e.wordsPerMinute ?? 0), 0) /
      Math.max(1, answered.length);
    const avgDurationSec =
      answered.reduce((sum, e) => sum + (e.answerDurationSec ?? 0), 0) /
      Math.max(1, answered.length);

    let communicationScore = 70;
    if (totalFillers <= 3) communicationScore += 10;
    else if (totalFillers <= 8) communicationScore += 5;
    else communicationScore -= Math.min(20, totalFillers * 2);

    if (avgWPM > 0 && avgWPM < 90) communicationScore -= 15;
    else if (avgWPM > 0 && avgWPM < 110) communicationScore -= 8;
    else if (avgWPM >= 120 && avgWPM <= 170) communicationScore += 5;

    if (avgDurationSec > 0 && avgDurationSec < 45) communicationScore -= 15;
    else if (avgDurationSec > 0 && avgDurationSec < 75) communicationScore -= 8;

    communicationScore = Math.max(0, Math.min(100, communicationScore));

    const feedbackRes = await fetch('/api/ai/voice-interview-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: currentSession.category,
        exchanges: currentSession.exchanges,
        avgContentScore: avgContent,
        totalFillerWords: totalFillers,
        avgWPM,
      }),
    });

    let aiFeedback = 'Great effort! Review your per-answer feedback for specific improvements.';
    if (feedbackRes.ok) {
      const fb = await feedbackRes.json();
      aiFeedback = fb.feedback;
    }

    const overallScore = Math.round(avgContent * 0.7 + communicationScore * 0.3);

    await fetch(`/api/voice-interviews/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'complete',
        aiFeedback,
        overallScore,
        contentScore: Math.round(avgContent),
        communicationScore,
      }),
    });

    await loadSession();
    setPhase('complete');
  };

  const handleEndEarly = async () => {
    if (!session) return;
    if (session.exchanges.length === 0) {
      router.push('/simulator/voice');
      return;
    }
    setSubmitting(true);
    try {
      await finishSession(session);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <p className="font-body text-base text-error">Session not found.</p>
    );
  }

  if (phase === 'complete') {
    return (
      <VoiceInterviewResults
        session={session}
        questions={questions}
        onPracticeAgain={async (questionId) => {
          const res = await fetch('/api/voice-interviews/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: 'mixed',
              difficulty: 'mixed',
              sessionQuestionCount: 1,
              includeFollowUps: true,
              questionId,
            }),
          });
          const data = await res.json();
          if (res.ok) router.push(`/simulator/voice/${data.sessionId}`);
        }}
      />
    );
  }

  const bankQuestion = getCurrentBankQuestion();
  const categoryLabel =
    session.category === 'mixed'
      ? bankQuestion
        ? getCategoryLabel(bankQuestion.category)
        : 'Mixed'
      : getCategoryLabel(session.category as Parameters<typeof getCategoryLabel>[0]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="font-body text-sm text-text-muted">
            Question {currentQuestionIndex + 1} of {session.sessionQuestionCount} ·{' '}
            {categoryLabel} · {session.difficulty}
          </p>
        </div>
        <Button variant="ghost" onClick={handleEndEarly} disabled={submitting}>
          End
        </Button>
      </div>

      {pendingQuestion && (
        <div className="bg-bg-surface rounded-xl shadow-card p-6 space-y-6">
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">
              AI Interviewer 🤖
            </h2>
            <div className="bg-bg-subtle border-l-4 border-brand rounded-r-md p-4">
              <p className="font-body text-base text-text-primary leading-relaxed">
                &ldquo;{pendingQuestion.text}&rdquo;
              </p>
            </div>
            {isSpeechSynthesisSupported() && (
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className="font-body text-sm text-brand hover:underline"
              >
                ▶ Hear question read aloud
              </button>
            )}
            {bankQuestion?.context && (
              <div className="bg-info-light border border-info/20 rounded-md p-4">
                <p className="font-body text-base text-text-primary">{bankQuestion.context}</p>
              </div>
            )}
          </section>

          <section className="space-y-4 border-t border-border-subtle pt-6">
            <h2 className="font-display font-semibold text-lg text-text-primary">Your Answer</h2>

            <VoiceInterviewRecorder
              onTranscriptReady={handleTranscriptReady}
              disabled={submitting}
            />

            {(transcript || typedAnswer) && (
              <div className="p-4 bg-bg-subtle rounded-md border border-border-subtle">
                <p className="font-body text-xs font-semibold text-text-muted uppercase mb-1">
                  Transcript preview
                </p>
                <p className="font-body text-base text-text-primary">{transcript || typedAnswer}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="font-body text-sm text-text-muted">Or type if you prefer:</p>
              <textarea
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                rows={4}
                placeholder="Type your answer here…"
                className="w-full p-4 rounded-md border border-border-subtle bg-bg-surface font-body text-base text-text-primary resize-y focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {error && (
              <p className="font-body text-sm text-error bg-error-light border border-error/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button onClick={submitAnswer} disabled={submitting} className="w-full">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" /> Submitting…
                </span>
              ) : (
                'Submit Answer →'
              )}
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}
