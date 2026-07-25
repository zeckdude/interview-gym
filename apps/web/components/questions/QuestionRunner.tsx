'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { MostAskedBadge, MostAskedMenu } from '@/components/content/MostAskedMenu';
import { QuestionPromptAudio } from '@/components/questions/QuestionPromptAudio';
import { useBadgeCelebrationOptional } from '@/components/providers/BadgeCelebrationProvider';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import { gradeAnswer } from '@/data/types';
import type { ConceptualQuestion } from '@/data/types';
import { useContentFilterQuery } from '@/hooks/useContentFilterQuery';
import { buildListPath } from '@/lib/content-filter-url';
import { getQuestionDisplayLabel } from '@/lib/categories';
import { getCuratedMostAskedForQuestion } from '@/lib/most-asked';

interface QuestionRunnerProps {
  question: ConceptualQuestion;
}

type SubmissionState = 'idle' | 'submitting' | 'done';

interface GradeResult {
  passed: boolean;
  matchedTerms: string[];
  score: number;
  feedback?: string;
  gradingMethod?: string;
}

function highlightKeyTerms(text: string, matchedTerms: string[]): React.ReactNode {
  if (matchedTerms.length === 0) return text;

  const sortedTerms = [...matchedTerms].sort((a, b) => b.length - a.length);
  const escaped = sortedTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const isMatch = sortedTerms.some((t) => t.toLowerCase() === part.toLowerCase());
    return isMatch ? (
      <mark key={i} className="bg-success-light text-success px-0.5 rounded-sm font-semibold not-italic">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export function QuestionRunner({ question }: QuestionRunnerProps) {
  const [answer, setAnswer] = useState('');
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [result, setResult] = useState<GradeResult | null>(null);
  const badgeCelebration = useBadgeCelebrationOptional();
  const filterQuery = useContentFilterQuery();
  const mostAskedCtx = useMostAskedOptional();

  const curatedMostAsked = getCuratedMostAskedForQuestion(question);
  const effectiveMostAsked =
    mostAskedCtx?.getEffective('question', question.id, curatedMostAsked) ?? {
      ...curatedMostAsked,
      isPersonalOverride: false,
    };

  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || submissionState === 'submitting') return;

    setSubmissionState('submitting');

    try {
      const res = await fetch('/api/ai/grade-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          userAnswer: answer,
        }),
      });

      if (res.ok) {
        const data = await res.json() as GradeResult;
        setResult(data);

        const attemptRes = await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: question.id,
            challengeType: question.category,
            answer,
            passed: data.passed,
          }),
        });
        if (attemptRes.ok) {
          const attemptData = await attemptRes.json();
          if (attemptData.newBadges?.length) {
            badgeCelebration?.showBadges(attemptData.newBadges);
          }
        }
      } else {
        // Fallback to client-side keyword grading
        const gradeResult = gradeAnswer(answer, question);
        setResult(gradeResult);
      }
    } catch {
      const gradeResult = gradeAnswer(answer, question);
      setResult(gradeResult);
    } finally {
      setSubmissionState('done');
    }
  }, [answer, question, submissionState, badgeCelebration]);

  const handleReset = useCallback(() => {
    setAnswer('');
    setResult(null);
    setSubmissionState('idle');
  }, []);

  const categoryLabel = getQuestionDisplayLabel(question.category);
  const categoryClass =
    question.category === 'be-question'
      ? 'bg-cat-be-light text-cat-be'
      : question.category === 'nextjs-question'
        ? 'bg-cat-nextjs-light text-cat-nextjs'
        : 'bg-cat-fe-light text-cat-fe';

  const difficultyClass = {
    easy: 'bg-easy-light text-easy',
    intermediate: 'bg-medium-light text-medium',
    advanced: 'bg-hard-light text-hard',
  }[question.difficulty];

  return (
    <PageWrapper title={question.question.slice(0, 60)}>
      <div className="max-w-3xl mx-auto space-y-8">
        <ContentBreadcrumbs
          items={[
            { label: 'Questions', href: buildListPath('/questions', filterQuery) },
            { label: 'Question' },
          ]}
        />

        {/* Question */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-body font-semibold ${categoryClass}`}>
                {categoryLabel}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-body font-semibold capitalize ${difficultyClass}`}>
                {question.difficulty}
              </span>
              <MostAskedBadge
                mostAsked={effectiveMostAsked.mostAsked}
                isPersonalOverride={effectiveMostAsked.isPersonalOverride}
                reason={effectiveMostAsked.reason}
              />
            </div>
            <MostAskedMenu itemType="question" itemId={question.id} curated={curatedMostAsked} />
          </div>

          <QuestionPromptAudio questionText={question.question} />

          <div className="flex flex-wrap gap-2">
            {question.concepts.map((concept) => (
              <span
                key={concept}
                className="px-2.5 py-1 bg-bg-subtle dark:bg-[#1A1A1A] text-text-secondary dark:text-[#AAA5A0] text-xs font-body rounded-md border border-border-subtle dark:border-[#2A2A2A]"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Answer textarea */}
        {submissionState !== 'done' && (
          <div className="space-y-4">
            <div className="bg-bg-surface dark:bg-[#141414] border border-border-subtle dark:border-[#2A2A2A] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border-subtle dark:border-[#2A2A2A]">
                <p className="font-body text-sm font-semibold text-text-secondary dark:text-[#AAA5A0]">
                  Your Answer
                </p>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here. Be thorough — mention the key concepts, trade-offs, and real-world use cases you know."
                rows={10}
                className="w-full bg-transparent px-4 py-4 text-text-primary dark:text-[#F0EDE8] font-body text-base placeholder:text-text-muted dark:placeholder:text-[#6A6560] focus:outline-none resize-y"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="font-body text-sm text-text-muted dark:text-[#6A6560]">
                {answer.split(/\s+/).filter(Boolean).length} words
              </p>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || submissionState === 'submitting'}
                className="px-6 py-3 bg-brand hover:bg-brand-dark text-text-inverse font-body font-semibold rounded-md transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-brand hover:shadow-raised"
              >
                {submissionState === 'submitting' ? 'Checking…' : 'Check Answer'}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {submissionState === 'done' && result && (
          <div className="space-y-6">
            {/* Pass/Fail Banner */}
            {result.passed ? (
              <div className="bg-success-light border border-success rounded-lg p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏋️</span>
                  <div>
                    <p className="font-display font-bold text-lg text-success">
                      Solid answer! You nailed it.
                    </p>
                    <p className="font-body text-sm text-success mt-0.5">
                      {result.feedback ?? `You covered ${result.matchedTerms.length} of ${question.keyTerms.length} key concepts (${Math.round(result.score * 100)}%).`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-error-light border border-error rounded-lg p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <p className="font-display font-bold text-lg text-error">
                      Almost — keep pushing.
                    </p>
                    <p className="font-body text-sm text-error mt-0.5">
                      {result.feedback ?? `You covered ${result.matchedTerms.length} of ${question.keyTerms.length} key concepts (${Math.round(result.score * 100)}%). Review the model answer and try again.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Your answer */}
            <div className="bg-bg-surface dark:bg-[#141414] border border-border-subtle dark:border-[#2A2A2A] rounded-lg p-5 space-y-3">
              <p className="font-body text-sm font-semibold text-text-secondary dark:text-[#AAA5A0]">
                Your Answer
              </p>
              <p className="font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>

            {/* Key terms matched */}
            {result.matchedTerms.length > 0 && (
              <div className="bg-bg-subtle dark:bg-[#1A1A1A] border border-border-subtle dark:border-[#2A2A2A] rounded-lg p-5 space-y-3">
                <p className="font-body text-sm font-semibold text-text-secondary dark:text-[#AAA5A0]">
                  Key Terms You Covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedTerms.map((term) => (
                    <span key={term} className="px-2.5 py-1 bg-success-light text-success text-xs font-body font-semibold rounded-md">
                      ✓ {term}
                    </span>
                  ))}
                  {question.keyTerms
                    .filter((t) => !result.matchedTerms.includes(t))
                    .map((term) => (
                      <span key={term} className="px-2.5 py-1 bg-error-light text-error text-xs font-body rounded-md opacity-70">
                        ✗ {term}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Model Answer */}
            <div className="bg-bg-surface dark:bg-[#141414] border-2 border-brand rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-brand-light dark:bg-[#1A1800] border-b border-brand">
                <p className="font-body text-sm font-semibold text-brand">
                  Model Answer — Key terms highlighted in green
                </p>
              </div>
              <div className="p-5">
                <p className="font-body text-base text-text-primary dark:text-[#F0EDE8] leading-relaxed whitespace-pre-wrap">
                  {highlightKeyTerms(question.modelAnswer, result.matchedTerms)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-bg-surface dark:bg-[#1A1A1A] border border-border-subtle dark:border-[#2A2A2A] text-text-primary dark:text-[#F0EDE8] font-body font-semibold text-sm rounded-md hover:border-brand hover:text-brand transition-all duration-150"
              >
                Try Again
              </button>
              <Link
                href="/questions"
                className="px-5 py-2.5 text-text-secondary dark:text-[#AAA5A0] font-body text-sm hover:text-brand transition-colors duration-150"
              >
                ← Back to Questions
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
