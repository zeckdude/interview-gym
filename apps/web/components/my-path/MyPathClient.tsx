'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CreatePathModal } from '@/components/my-path/CreatePathModal';
import { DailyQueue } from '@/components/my-path/DailyQueue';
import { StageSection } from '@/components/my-path/StageSection';
import { PATH_TYPE_LABELS, type PathType } from '@/lib/paths/types';
import type { StageStatus } from '@/lib/paths/types';
import type { ResolvedPathItem, PathQueueItem } from '@/lib/paths/types';
import { cn } from '@/lib/utils';

interface PathSummary {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  interviewDate: string | null;
  dailyHours: number | null;
  createdAt: string;
}

interface StageView {
  stage: number;
  label: string;
  name: string;
  description: string;
  status: StageStatus;
  total: number;
  complete: number;
  remaining: number;
  items: ResolvedPathItem[];
}

interface PathView {
  path: PathSummary;
  currentStage: number;
  totalItems: number;
  totalComplete: number;
  dailyQueue: PathQueueItem[];
  stages: StageView[];
}

function daysUntil(dateIso: string): number {
  const target = new Date(dateIso);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function MyPathClient() {
  const [paths, setPaths] = useState<PathSummary[]>([]);
  const [activeView, setActiveView] = useState<PathView | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadPaths = useCallback(async () => {
    const res = await fetch('/api/paths');
    if (!res.ok) return [];
    const data = await res.json();
    return data.paths as PathSummary[];
  }, []);

  const loadPathView = useCallback(async (pathId: string) => {
    const res = await fetch(`/api/paths/${pathId}`);
    if (!res.ok) return null;
    return res.json() as Promise<PathView>;
  }, []);

  const refresh = useCallback(async (pathId?: string) => {
    const list = await loadPaths();
    setPaths(list);

    const targetId =
      pathId ?? list.find((p) => p.isActive)?.id ?? list[0]?.id ?? null;

    if (targetId) {
      const view = await loadPathView(targetId);
      setActiveView(view);
    } else {
      setActiveView(null);
    }

    setLoaded(true);
  }, [loadPaths, loadPathView]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleCreate = async (type: PathType, name: string) => {
    setCreating(true);
    try {
      const res = await fetch('/api/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, setActive: true }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setCreateOpen(false);
      setActiveView(data.path);
      await refresh(data.path.path.id);
    } finally {
      setCreating(false);
    }
  };

  const handleSwitch = async (pathId: string) => {
    await fetch('/api/paths/active', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathId }),
    });
    setSwitcherOpen(false);
    await refresh(pathId);
  };

  const handleMarkUnderstood = async (itemId: string) => {
    if (!activeView) return;
    setMarkingId(itemId);
    try {
      const res = await fetch(`/api/paths/${activeView.path.id}/understood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveView(data.path);
      }
    } finally {
      setMarkingId(null);
    }
  };

  const currentStageData = activeView?.stages.find(
    (s) => s.stage === activeView.currentStage
  );

  return (
    <PageWrapper title="My Path">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              My Path
            </h1>
            <p className="font-body text-text-secondary max-w-xl">
              Your curated interview prep — staged from phone screen to system design.
            </p>
          </div>

          {activeView && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSwitcherOpen(!switcherOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-subtle bg-bg-surface font-body text-sm font-semibold text-text-primary hover:bg-bg-muted transition-colors"
                >
                  Active: {activeView.path.name}
                  <span className="text-text-muted">▾</span>
                </button>
                {switcherOpen && paths.length > 0 && (
                  <div className="absolute right-0 top-full mt-1 z-10 min-w-[220px] rounded-md border border-border-subtle bg-bg-surface shadow-modal py-1">
                    {paths.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSwitch(p.id)}
                        className={cn(
                          'w-full text-left px-4 py-2 font-body text-sm hover:bg-bg-muted transition-colors',
                          p.isActive ? 'text-brand font-semibold' : 'text-text-primary'
                        )}
                      >
                        {p.name}
                        <span className="text-text-muted ml-1">
                          ({PATH_TYPE_LABELS[p.type as PathType] ?? p.type})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="px-4 py-2 rounded-md bg-brand text-white font-body text-sm font-semibold shadow-brand hover:opacity-90 transition-opacity"
              >
                + New Path
              </button>
            </div>
          )}
        </div>

        {!loaded ? (
          <p className="font-body text-sm text-text-secondary">Loading your path…</p>
        ) : !activeView ? (
          <div className="rounded-lg border border-border-subtle bg-bg-surface p-8 text-center space-y-6">
            <div>
              <p className="font-display font-bold text-2xl text-text-primary mb-2">
                No learning path yet
              </p>
              <p className="font-body text-base text-text-secondary max-w-md mx-auto">
                Choose FE Only, BE Only, or Full Stack — we&apos;ll guide you through three
                interview readiness stages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="px-6 py-3 rounded-md bg-brand text-white font-body font-semibold shadow-brand hover:opacity-90"
            >
              Create Your First Path →
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border-subtle bg-bg-surface p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-light border border-brand/30 font-body text-sm font-semibold text-text-primary">
                  {PATH_TYPE_LABELS[activeView.path.type as PathType] ?? activeView.path.type}
                </span>
                {activeView.path.interviewDate && (
                  <span className="font-body text-sm text-text-primary">
                    📅 Interview:{' '}
                    {new Date(activeView.path.interviewDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' · '}
                    <span className="font-semibold">
                      {daysUntil(activeView.path.interviewDate)} days away
                    </span>
                  </span>
                )}
              </div>

              {currentStageData && (
                <div>
                  <p className="font-body text-sm font-semibold text-text-primary mb-2">
                    {currentStageData.name}: {currentStageData.complete}/{currentStageData.total}{' '}
                    complete
                  </p>
                  <div className="h-3 rounded-full bg-bg-muted overflow-hidden">
                    <div
                      className="h-full bg-success transition-all"
                      style={{
                        width: `${
                          currentStageData.total > 0
                            ? Math.round(
                                (currentStageData.complete / currentStageData.total) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <DailyQueue items={activeView.dailyQueue} />

            <div className="space-y-10">
              {activeView.stages.map((stage) => (
                <StageSection
                  key={stage.stage}
                  stage={stage.stage}
                  status={stage.status}
                  total={stage.total}
                  complete={stage.complete}
                  items={stage.items}
                  onMarkUnderstood={handleMarkUnderstood}
                  markingId={markingId}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CreatePathModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        creating={creating}
      />
    </PageWrapper>
  );
}
