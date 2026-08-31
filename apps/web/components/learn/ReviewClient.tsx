'use client';

import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import {
  LearnCodeBlock,
  LearnInlineText,
  ResultPanel,
} from '@/components/learn/LearnCodeBlock';
import { Button } from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  combineLearnCode,
  extractUserCodeFromStored,
} from '@/lib/learn/code-error-line';
import {
  validateCodeChallenge,
  validatePredictOutput,
  formatQuotedDisplayOutput,
} from '@/lib/learn/execute-code';
import { getResolvedLearningSettings } from '@/lib/learn/learning-preferences';
import type { ConceptWeight, LearnGoalType, LearnOutputFlex } from '@/data/learn/types';

interface ReviewItem {
  id: string;
  conceptTag: string;
  moduleId: string;
  stepId: string;
  reviewType: string;
  reviewData: {
    prompt?: string;
    code?: string;
    setupCode?: string;
    starterCode?: string;
    solutionCode?: string;
    expectedOutput: string;
    goalType?: LearnGoalType;
    outputFlex?: LearnOutputFlex;
    hint?: string;
  };
  weight: ConceptWeight;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function reviewDisplayOutput(item: ReviewItem): string {
  const { reviewData, reviewType } = item;
  if (reviewType === 'predict_output' && reviewData.code) {
    return formatQuotedDisplayOutput(reviewData.code, reviewData.expectedOutput);
  }
  if (reviewType === 'code_goal') {
    const referenceCode = reviewData.solutionCode
      ? `${reviewData.setupCode ?? ''}\n${reviewData.solutionCode}`
      : reviewData.code;
    if (referenceCode?.trim()) {
      return formatQuotedDisplayOutput(referenceCode, reviewData.expectedOutput);
    }
  }
  return reviewData.expectedOutput;
}

export function ReviewClient() {
  const [manual, setManual] = useState(false);
  const { data, mutate } = useSWR<{ items: ReviewItem[]; conceptTags: string[] }>(
    `/api/learn/review?manual=${manual}&limit=10`,
    fetcher
  );

  const items = data?.items ?? [];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [hintShown, setHintShown] = useState(false);

  const current = items[index];

  const loadItem = useCallback((item: ReviewItem) => {
    setAnswer('');
    setResult(null);
    setHintShown(false);
    if (item.reviewType === 'code_goal') {
      setCode(
        extractUserCodeFromStored(
          `${item.reviewData.setupCode ?? ''}\n${item.reviewData.starterCode ?? ''}`,
          item.reviewData.setupCode ?? '',
          item.reviewData.starterCode ?? ''
        )
      );
    } else {
      setCode('');
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      loadItem(items[index] ?? items[0]);
    }
  }, [items, index, loadItem]);

  const submitReview = async (correct: boolean) => {
    if (!current) return;
    await fetch('/api/learn/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewId: current.id,
        correct,
        hintUsed: hintShown,
      }),
    });
    const next = index + 1;
    if (next < items.length) {
      setIndex(next);
      loadItem(items[next]);
    } else {
      void mutate();
      setIndex(0);
    }
  };

  const handleCheck = () => {
    if (!current) return;
    let passed = false;
    if (current.reviewType === 'predict_output') {
      passed = validatePredictOutput(
        answer,
        current.reviewData.expectedOutput,
        current.stepId,
        current.reviewData.code
      ).passed;
    } else {
      const fullCode = combineLearnCode(
        current.reviewData.setupCode ?? '',
        code
      );
      const referenceCode = current.reviewData.solutionCode
        ? `${current.reviewData.setupCode ?? ''}\n${current.reviewData.solutionCode}`
        : undefined;
      passed = validateCodeChallenge(
        fullCode,
        current.reviewData.expectedOutput,
        current.stepId,
        current.reviewData.goalType ?? 'output',
        referenceCode,
        current.reviewData.outputFlex
      ).passed;
    }
    setResult(passed);
    if (passed) {
      void submitReview(true);
    }
  };

  const setWeight = async (conceptTag: string, weight: ConceptWeight) => {
    await fetch('/api/learn/review/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conceptTag, weight }),
    });
    void mutate();
  };

  if (!current) {
    return (
      <PageWrapper title="Review">
        <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
          <h1 className="font-display font-bold text-2xl text-text-primary">Review</h1>
          <p className="font-body text-base text-text-primary">
            {items.length === 0
              ? 'No review items yet. Complete a module to add concepts to your mastery queue.'
              : 'All caught up! Check back later or run a manual review.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => { setManual(true); void mutate(); }}>
              Manual review
            </Button>
            <Link href="/">
              <Button variant="secondary">Back to path</Button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Review">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Review</h1>
            <p className="font-body text-sm text-text-muted">
              {manual ? 'Manual' : 'Spaced repetition'} · {index + 1} of {items.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={manual ? 'primary' : 'secondary'}
              onClick={() => setManual(!manual)}
            >
              {manual ? 'Manual on' : 'Manual off'}
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-bg-subtle border border-border-subtle px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-sm text-brand">{current.conceptTag}</span>
          <div className="flex gap-2">
            <span className="font-body text-xs text-text-muted mr-1">Ask me:</span>
            <button
              type="button"
              onClick={() => void setWeight(current.conceptTag, -1)}
              className={`text-xs px-2 py-1 rounded ${current.weight === -1 ? 'bg-brand text-white' : 'bg-bg-surface border border-border-subtle'}`}
            >
              Less
            </button>
            <button
              type="button"
              onClick={() => void setWeight(current.conceptTag, 0)}
              className={`text-xs px-2 py-1 rounded ${current.weight === 0 ? 'bg-brand text-white' : 'bg-bg-surface border border-border-subtle'}`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => void setWeight(current.conceptTag, 1)}
              className={`text-xs px-2 py-1 rounded ${current.weight === 1 ? 'bg-brand text-white' : 'bg-bg-surface border border-border-subtle'}`}
            >
              More
            </button>
          </div>
        </div>

        {current.reviewData.prompt && (
          <LearnInlineText content={current.reviewData.prompt} />
        )}

        {current.reviewType === 'predict_output' && current.reviewData.code && (
          <LearnCodeBlock code={current.reviewData.code} />
        )}

        {current.reviewType === 'code_goal' && (
          <LearnCodeBlock
            code=""
            editable
            setupCode={
              getResolvedLearningSettings(current.moduleId).setupCodeSplit
                ? current.reviewData.setupCode
                : undefined
            }
            value={code}
            onChange={setCode}
            editorSettings={getResolvedLearningSettings(current.moduleId)}
          />
        )}

        <ResultPanel
          goal={reviewDisplayOutput(current)}
          yours={result === null ? undefined : answer || '—'}
          passed={result}
        />

        {current.reviewType === 'predict_output' && (
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-bg-surface font-mono text-base"
            placeholder="Your answer…"
          />
        )}

        <div className="flex gap-3">
          <Button onClick={handleCheck}>Check</Button>
          {current.reviewData.hint && (
            <Button variant="secondary" onClick={() => setHintShown(true)}>Hint</Button>
          )}
          {result === false && (
            <Button variant="secondary" onClick={() => void submitReview(false)}>
              Skip & reschedule
            </Button>
          )}
        </div>

        {hintShown && current.reviewData.hint && (
          <div className="rounded-lg bg-brand/10 p-4">
            <LearnInlineText content={current.reviewData.hint} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
