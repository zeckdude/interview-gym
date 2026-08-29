'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';
import type { LearnGraphNode } from '@/data/learn/graph';
import type { ModuleProgressView } from '@/data/learn/types';
import { LEVEL_LABELS } from '@/data/learn/graph';

interface PathMapProps {
  nodes: LearnGraphNode[];
  moduleProgress: ModuleProgressView[];
  stats: {
    completed: number;
    available: number;
    total: number;
    reviewDueCount: number;
  };
}

type ResetTarget =
  | { type: 'module'; moduleId: string; title: string }
  | { type: 'all' }
  | null;

function statusFor(
  moduleId: string,
  progress: ModuleProgressView[]
): ModuleProgressView['status'] {
  return progress.find((p) => p.moduleId === moduleId)?.status ?? 'locked';
}

function hasResettableProgress(status: ModuleProgressView['status']): boolean {
  return status === 'in_progress' || status === 'completed';
}

export function PathMap({ nodes, moduleProgress, stats }: PathMapProps) {
  const router = useRouter();
  const [resetTarget, setResetTarget] = useState<ResetTarget>(null);
  const [resetting, setResetting] = useState(false);

  const levels = Array.from(new Set(nodes.map((n) => n.level))).sort((a, b) => a - b);
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const hasAnyProgress = moduleProgress.some((p) => hasResettableProgress(p.status));

  const handleResetConfirm = useCallback(async () => {
    if (!resetTarget) return;

    setResetting(true);
    try {
      const url =
        resetTarget.type === 'all'
          ? '/api/learn/progress?scope=all'
          : `/api/learn/progress?moduleId=${encodeURIComponent(resetTarget.moduleId)}`;

      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Reset failed');

      setResetTarget(null);
      router.refresh();
    } finally {
      setResetting(false);
    }
  }, [resetTarget, router]);

  const dialogProps =
    resetTarget?.type === 'all'
      ? {
          title: 'Reset all learn progress?',
          message:
            'This will permanently erase progress for every module on your path, all review queue items, and hint history.\n\nYou will start the path from the beginning. This cannot be undone.',
          confirmLabel: 'Yes, reset everything',
        }
      : resetTarget?.type === 'module'
        ? {
            title: `Reset "${resetTarget.title}"?`,
            message:
              'This will permanently erase your step progress, completion status, review items, and hint history for this module.\n\nThis cannot be undone.',
            confirmLabel: 'Yes, reset module',
          }
        : null;

  return (
    <>
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              Modern JavaScript
            </h1>
            <p className="font-body text-base text-text-primary max-w-xl">
              JavaScript from the ground up. Complete modules in order — branch when
              multiple paths unlock. Only Introduction and Variables are live; the rest
              unlock as content ships.
            </p>
          </div>

          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 min-w-[200px] space-y-3 shrink-0">
            <div className="text-center">
              <div
                className="mx-auto w-20 h-20 rounded-full border-4 border-brand/20 flex items-center justify-center relative"
                style={{
                  background: `conic-gradient(var(--tw-gradient-from, #FF6B35) ${pct * 3.6}deg, transparent 0)`,
                }}
              >
                <span className="font-display font-bold text-lg text-text-primary bg-bg-surface rounded-full w-14 h-14 flex items-center justify-center">
                  {pct}%
                </span>
              </div>
            </div>
            <dl className="font-body text-sm space-y-1 text-text-primary">
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Lessons</dt>
                <dd className="font-semibold">
                  {stats.completed} / {stats.total}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Live now</dt>
                <dd className="font-semibold">{stats.available}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Reviews due</dt>
                <dd className="font-semibold">
                  <Link href="/review" className="text-brand hover:underline">
                    {stats.reviewDueCount}
                  </Link>
                </dd>
              </div>
            </dl>

            {hasAnyProgress && (
              <button
                type="button"
                onClick={() => setResetTarget({ type: 'all' })}
                className="w-full font-body text-sm font-semibold text-error hover:text-error/80 border border-error/30 hover:border-error/50 rounded-md px-3 py-2 transition-colors"
              >
                Reset all progress
              </button>
            )}
          </div>
        </div>

        {levels.map((level) => {
          const levelNodes = nodes.filter((n) => n.level === level);
          return (
            <section key={level} className="space-y-4">
              <h2 className="font-display font-bold text-lg text-text-primary border-b border-border-subtle pb-2">
                Level {level} — {LEVEL_LABELS[level]}
              </h2>

              <div className="relative flex flex-col items-center gap-0 py-2">
                {levelNodes.map((node, idx) => {
                  const status = statusFor(node.id, moduleProgress);
                  const isReview = node.kind === 'review';
                  const canReset = hasResettableProgress(status);
                  const href =
                    status === 'locked' || !node.contentAvailable
                      ? undefined
                      : `/learn/${node.id}`;

                  const cardContent = (
                    <div
                      className={cn(
                        'relative w-full max-w-md px-5 py-3 rounded-lg border-2 text-center transition-all',
                        isReview && 'max-w-lg py-4 bg-brand/5 border-brand',
                        !isReview && status === 'completed' && 'border-success/50 bg-success/5',
                        !isReview && status === 'in_progress' && 'border-brand bg-brand/10 shadow-brand',
                        !isReview && status === 'available' && 'border-brand/60 bg-bg-surface hover:bg-brand/5',
                        status === 'locked' && 'border-border-subtle bg-bg-subtle opacity-60',
                        node.isExtra && !isReview && 'border-dashed',
                        href && 'hover:bg-brand/5'
                      )}
                    >
                      {status === 'completed' && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-success text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Finished ✓
                        </span>
                      )}
                      {node.isExtra && (
                        <span className="block text-xs font-body text-brand mb-0.5">Extra</span>
                      )}
                      <p className="font-body font-semibold text-base text-text-primary">
                        {node.title}
                      </p>
                      {!node.contentAvailable && status !== 'locked' && (
                        <p className="font-body text-xs text-text-muted mt-1">Coming soon</p>
                      )}
                    </div>
                  );

                  return (
                    <div key={node.id} className="flex flex-col items-center w-full">
                      {idx > 0 && (
                        <div
                          className={cn(
                            'w-0.5 h-6',
                            status === 'locked' ? 'border-l-2 border-dashed border-border-subtle' : 'bg-brand/40'
                          )}
                        />
                      )}
                      <div className="relative w-full max-w-md">
                        {canReset && (
                          <button
                            type="button"
                            aria-label={`Reset progress for ${node.title}`}
                            onClick={() =>
                              setResetTarget({
                                type: 'module',
                                moduleId: node.id,
                                title: node.title,
                              })
                            }
                            className="absolute top-2 right-2 z-10 font-body text-xs font-semibold text-error hover:text-error/80 px-2 py-1 rounded border border-error/30 hover:border-error/50 bg-bg-surface/90 transition-colors"
                          >
                            Reset
                          </button>
                        )}
                        {href ? (
                          <Link href={href} className="block w-full">
                            {cardContent}
                          </Link>
                        ) : (
                          cardContent
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {dialogProps && (
        <ConfirmDialog
          open={resetTarget !== null}
          title={dialogProps.title}
          message={dialogProps.message}
          confirmLabel={dialogProps.confirmLabel}
          destructive
          loading={resetting}
          onConfirm={() => void handleResetConfirm()}
          onCancel={() => {
            if (!resetting) setResetTarget(null);
          }}
        />
      )}
    </>
  );
}
