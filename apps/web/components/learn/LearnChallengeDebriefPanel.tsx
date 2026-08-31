import { LearnCodeBlock, LearnInlineText } from '@/components/learn/LearnCodeBlock';
import {
  LearnDisclosurePanel,
  LearnRecommendedAnswer,
} from '@/components/learn/LearnRecommendedAnswer';
import { Button } from '@/components/ui/Button';
import type { LearnChallengeDebrief } from '@/data/learn/types';
import { cn } from '@/lib/utils';

interface LearnChallengeDebriefContentProps {
  debrief: LearnChallengeDebrief;
  skipped?: boolean;
  solutionCode?: string;
}

function DebriefLabel({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'warning' | 'brand';
}) {
  return (
    <span
      className={cn(
        'shrink-0 font-body text-xs font-bold uppercase tracking-wide rounded-md px-2.5 py-1',
        tone === 'warning' && 'bg-warning-light text-warning',
        tone === 'brand' && 'bg-brand-light text-brand'
      )}
    >
      {children}
    </span>
  );
}

function DebriefEvaluationTrace({
  steps,
}: {
  steps: NonNullable<LearnChallengeDebrief['evaluationSteps']>;
}) {
  return (
    <ol className="space-y-3 list-none m-0 p-0">
      {steps.map((step, index) => (
        <li key={index} className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-body text-sm font-semibold text-text-muted tabular-nums w-5">
            {index + 1}.
          </span>
          <code className="font-mono text-sm text-text-primary bg-bg-surface border border-border-subtle rounded-md px-2.5 py-1">
            {step.expression}
          </code>
          <span className="font-body text-sm text-text-muted" aria-hidden>
            →
          </span>
          <code className="font-mono text-sm text-text-primary bg-brand-light border border-brand/20 rounded-md px-2.5 py-1">
            {step.yields}
          </code>
        </li>
      ))}
    </ol>
  );
}

/** Trap → think it through (hero) → takeaway — inside the disclosure card. */
export function LearnChallengeDebriefContent({
  debrief,
  skipped = false,
  solutionCode,
}: LearnChallengeDebriefContentProps) {
  const codeSample = debrief.solutionCode ?? solutionCode;

  return (
    <article className="space-y-5">
      {skipped && (
        <p className="font-body text-sm text-text-muted m-0">
          You skipped — here&apos;s the pattern worth recognizing.
        </p>
      )}

      <div className="flex gap-4 items-start">
        <DebriefLabel tone="warning">Trap</DebriefLabel>
        <div className="min-w-0 flex-1 pt-0.5">
          <LearnInlineText content={debrief.gotcha} className="space-y-2" />
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-bg-subtle/60 p-5 space-y-4">
        <p className="font-body text-sm font-semibold text-text-primary m-0">
          Think it through
        </p>
        {debrief.evaluationSteps && debrief.evaluationSteps.length > 0 ? (
          <DebriefEvaluationTrace steps={debrief.evaluationSteps} />
        ) : null}
        <LearnInlineText content={debrief.greatSolution} className="space-y-3" />
        {codeSample ? <LearnCodeBlock code={codeSample} /> : null}
      </div>

      <div className="flex gap-4 items-start rounded-lg border border-dashed border-border-subtle bg-bg-surface px-4 py-3">
        <DebriefLabel tone="brand">Takeaway</DebriefLabel>
        <div className="min-w-0 flex-1 pt-0.5">
          <LearnInlineText content={debrief.watchFor} className="space-y-2" />
        </div>
      </div>
    </article>
  );
}

interface LearnOptionalChallengeDebriefProps {
  debrief: LearnChallengeDebrief;
  skipped?: boolean;
  solutionCode?: string;
  debriefAcknowledged: boolean;
  open: boolean;
  onToggle: () => void;
  onContinue: () => void;
}

/**
 * Optional Challenge Yourself debrief — same card on first view; toggle after Got it.
 */
export function LearnOptionalChallengeDebrief({
  debrief,
  skipped = false,
  solutionCode,
  debriefAcknowledged,
  open,
  onToggle,
  onContinue,
}: LearnOptionalChallengeDebriefProps) {
  const content = (
    <LearnChallengeDebriefContent
      debrief={debrief}
      skipped={skipped}
      solutionCode={solutionCode}
    />
  );

  if (!debriefAcknowledged) {
    return (
      <div className="mt-4 space-y-4">
        <LearnDisclosurePanel title="Challenge breakdown">{content}</LearnDisclosurePanel>
        <Button onClick={onContinue}>Got it — Continue →</Button>
      </div>
    );
  }

  return (
    <LearnRecommendedAnswer
      open={open}
      onToggle={onToggle}
      showLabel="Show challenge breakdown"
      hideLabel="Hide challenge breakdown"
      panelTitle="Challenge breakdown"
      className="mt-4"
    >
      {content}
    </LearnRecommendedAnswer>
  );
}
