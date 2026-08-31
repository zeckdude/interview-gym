'use client';

import { LearnCodeBlock } from '@/components/learn/LearnCodeBlock';
import { combineLearnCode } from '@/lib/learn/code-error-line';

interface LearnRevealComparisonProps {
  setupCode: string;
  userCode: string;
  solutionCode: string;
}

/** Side-by-side your attempt vs solution (Format on reveal — Option B). */
export function LearnRevealComparison({
  setupCode,
  userCode,
  solutionCode,
}: LearnRevealComparisonProps) {
  const yourFull = combineLearnCode(setupCode, userCode);
  const solutionFull = combineLearnCode(setupCode, solutionCode);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary">
          Your attempt
        </p>
        <LearnCodeBlock code={yourFull} />
      </div>
      <div className="space-y-2">
        <p className="font-body text-xs font-bold uppercase tracking-wide text-brand">
          Solution
        </p>
        <LearnCodeBlock code={solutionFull} />
      </div>
    </div>
  );
}
