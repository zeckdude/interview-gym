'use client';

import { cn } from '@/lib/utils';
import type { ResolvedPathItem, StageStatus } from '@/lib/paths/types';
import { STAGE_DEFINITIONS } from '@/lib/paths/stage-definitions';
import Link from 'next/link';

const STAGE_COLORS = {
  success: 'border-success bg-success-light',
  warning: 'border-warning bg-warning-light',
  brand: 'border-brand bg-brand-light',
} as const;

interface StageSectionProps {
  stage: number;
  status: StageStatus;
  total: number;
  complete: number;
  items: ResolvedPathItem[];
  onMarkUnderstood: (itemId: string) => Promise<void>;
  markingId: string | null;
}

function statusLabel(status: ResolvedPathItem['status']): string {
  switch (status) {
    case 'passed':
      return 'Passed';
    case 'understood':
      return 'Understood';
    case 'attempted':
      return 'In progress';
    case 'available':
      return 'Available';
    case 'locked':
      return 'Locked';
  }
}

function statusIcon(status: ResolvedPathItem['status']): string {
  switch (status) {
    case 'passed':
      return '✓';
    case 'understood':
      return '◐';
    case 'attempted':
      return '✗';
    case 'available':
      return '○';
    case 'locked':
      return '🔒';
  }
}

export function StageSection({
  stage,
  status,
  total,
  complete,
  items,
  onMarkUnderstood,
  markingId,
}: StageSectionProps) {
  const def = STAGE_DEFINITIONS[stage as 1 | 2 | 3];
  const colorClass = STAGE_COLORS[def.color];
  const isLocked = status === 'locked';
  const progressPct = total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <section className="space-y-4">
      <div className={cn('rounded-lg border-l-4 p-4', colorClass)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
              {def.label}
            </p>
            <h3 className="font-display font-bold text-xl text-text-primary mt-0.5">
              {def.name}
            </h3>
            <p className="font-body text-sm text-text-secondary mt-1 max-w-2xl">
              {def.description}
            </p>
          </div>
          <div className="text-right">
            {isLocked ? (
              <span className="inline-flex items-center gap-1 font-body text-sm font-semibold text-text-muted">
                🔒 Locked
              </span>
            ) : (
              <span className="font-body text-sm font-semibold text-text-primary">
                {complete}/{total} complete
              </span>
            )}
          </div>
        </div>

        {!isLocked && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-bg-muted overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="font-body text-xs text-text-muted mt-1">
              {total - complete} remaining · {progressPct}% done
            </p>
          </div>
        )}

        {isLocked && (
          <p className="font-body text-sm text-text-secondary mt-3">
            Complete Stage {stage - 1} to unlock
          </p>
        )}
      </div>

      {!isLocked && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.itemId}
              className="rounded-lg border border-border-subtle bg-bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={cn(
                      'font-mono text-sm font-bold flex-shrink-0 w-5',
                      item.status === 'passed' && 'text-success',
                      item.status === 'understood' && 'text-warning',
                      item.status === 'attempted' && 'text-error',
                      item.status === 'available' && 'text-text-muted'
                    )}
                  >
                    {statusIcon(item.status)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-body text-xs font-semibold uppercase text-text-muted">
                        {item.itemType}
                      </span>
                      {item.mostAsked && (
                        <span className="font-body text-xs font-semibold text-brand">Most Asked</span>
                      )}
                    </div>
                    <p className="font-body text-base text-text-primary font-semibold">
                      {item.title}
                    </p>
                    <p className="font-body text-sm text-text-secondary mt-0.5">
                      {statusLabel(item.status)}
                      {item.attempts > 0 && item.status === 'attempted'
                        ? ` (${item.attempts} attempt${item.attempts !== 1 ? 's' : ''})`
                        : ''}
                    </p>
                  </div>
                </div>

                {(item.status === 'available' || item.status === 'attempted') && (
                  <Link
                    href={item.href}
                    className="flex-shrink-0 px-3 py-1.5 rounded-md bg-brand text-white font-body text-sm font-semibold hover:opacity-90"
                  >
                    Start
                  </Link>
                )}
              </div>

              {item.markAsUnderstoodEligible && (
                <div className="mt-3 p-3 bg-warning-light border border-warning rounded-md">
                  <p className="font-body text-sm text-text-primary font-semibold mb-1">
                    Still stuck after {item.attempts} attempts?
                  </p>
                  <p className="font-body text-sm text-text-secondary mb-2">
                    You can mark this as understood and continue — but it will be flagged as a weak
                    spot and will come up again in your spaced repetition reviews.
                  </p>
                  <button
                    type="button"
                    disabled={markingId === item.itemId}
                    onClick={() => onMarkUnderstood(item.itemId)}
                    className="font-body text-sm font-semibold text-warning hover:underline disabled:opacity-50"
                  >
                    {markingId === item.itemId
                      ? 'Saving…'
                      : 'Mark as Understood and Continue →'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
