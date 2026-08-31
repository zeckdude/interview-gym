'use client';

import { cn } from '@/lib/utils';
import {
  buildOutputDiff,
  type DiffSegment,
  type OutputDiffRow,
} from '@/lib/learn/output-diff';
import type { OutputDiffMode } from '@/lib/learn/learning-preferences';

function segmentClass(kind: DiffSegment['kind'], side: 'goal' | 'yours'): string {
  if (kind === 'match') return 'text-text-primary';
  if (kind === 'missing') return 'bg-error/15 text-error rounded px-0.5';
  if (kind === 'extra') return 'bg-error/15 text-error rounded px-0.5';
  return side === 'goal'
    ? 'bg-success/15 text-success rounded px-0.5'
    : 'bg-error/15 text-error rounded px-0.5';
}

function renderSegments(segments: DiffSegment[], side: 'goal' | 'yours') {
  return segments.map((seg, i) => (
    <span key={i} className={cn('whitespace-pre-wrap', segmentClass(seg.kind, side))}>
      {seg.text}
      {i < segments.length - 1 ? ' ' : ''}
    </span>
  ));
}

function DiffRow({ row, showLineLabel }: { row: OutputDiffRow; showLineLabel?: number }) {
  return (
    <div className="space-y-2">
      {showLineLabel != null && (
        <p className="font-body text-xs font-semibold text-text-muted">Line {showLineLabel}</p>
      )}
      <div>
        <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary mb-1">
          Goal
        </p>
        <p className="font-mono text-[17px] leading-relaxed">{renderSegments(row.goal, 'goal')}</p>
      </div>
      <div>
        <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary mb-1">
          Yours
        </p>
        <p className="font-mono text-[17px] leading-relaxed">{renderSegments(row.yours, 'yours')}</p>
      </div>
    </div>
  );
}

interface OutputDiffViewProps {
  goal: string;
  yours: string;
  diffMode: Exclude<OutputDiffMode, 'off'>;
  goalLabel?: string;
  className?: string;
}

export function OutputDiffView({
  goal,
  yours,
  diffMode,
  goalLabel = 'Goal',
  className,
}: OutputDiffViewProps) {
  const rows = buildOutputDiff(goal, yours, diffMode);
  const multi = rows.length > 1;

  return (
    <div className={cn('space-y-4', className)}>
      {!multi ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border-2 border-border-subtle bg-bg-subtle p-4">
            <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary mb-2">
              {goalLabel}
            </p>
            <p className="font-mono text-[17px] leading-relaxed">
              {renderSegments(rows[0]!.goal, 'goal')}
            </p>
          </div>
          <div className="rounded-lg border-2 border-error/30 bg-error/5 p-4">
            <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary mb-2">
              Yours
            </p>
            <p className="font-mono text-[17px] leading-relaxed">
              {renderSegments(rows[0]!.yours, 'yours')}
            </p>
          </div>
        </div>
      ) : (
        rows.map((row, i) => (
          <DiffRow key={i} row={row} showLineLabel={i + 1} />
        ))
      )}
    </div>
  );
}
