'use client';

import { useEffect, useState } from 'react';
import { useStudyPlan } from '@/components/providers/StudyPlanProvider';
import type { StudyPlanItemType } from '@/lib/study-plan';

interface PickerCandidate {
  itemType: StudyPlanItemType;
  itemId: string;
  title: string;
  subtitle: string;
}

interface StudyPlanPickerProps {
  open: boolean;
  onClose: () => void;
}

export function StudyPlanPicker({ open, onClose }: StudyPlanPickerProps) {
  const { addToPlan, isInPlan } = useStudyPlan();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<{
    challenges: PickerCandidate[];
    lessons: PickerCandidate[];
  }>({ challenges: [], lessons: [] });

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ picker: '1', search });
        const res = await fetch(`/api/study-plan?${params.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          challenges: PickerCandidate[];
          lessons: PickerCandidate[];
        };
        if (!cancelled) setCandidates(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [open, search]);

  if (!open) return null;

  const renderGroup = (label: string, items: PickerCandidate[]) => (
    <div className="space-y-2">
      <h3 className="font-display font-semibold text-sm text-text-primary">{label}</h3>
      {items.length === 0 ? (
        <p className="font-body text-sm text-text-muted px-1">No matches.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item) => {
            const added = isInPlan(item.itemType, item.itemId);
            return (
              <div
                key={`${item.itemType}-${item.itemId}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border-subtle px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-text-primary truncate">
                    {item.title}
                  </p>
                  <p className="font-body text-xs text-text-muted capitalize">{item.subtitle}</p>
                </div>
                <button
                  type="button"
                  disabled={added}
                  onClick={async () => {
                    await addToPlan(item.itemType, item.itemId, 'picker');
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-md font-body text-xs font-semibold bg-brand text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {added ? 'Added' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-plan-picker-title"
        className="w-full max-w-lg rounded-xl border border-border-subtle bg-bg-surface shadow-modal p-6 space-y-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="study-plan-picker-title" className="font-display font-bold text-xl text-text-primary">
              Add to study plan
            </h2>
            <p className="font-body text-sm text-text-secondary mt-1">
              Pick from existing lessons and challenges only.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-muted hover:text-text-primary text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or concept…"
          className="w-full bg-bg-subtle border border-border-subtle rounded-md px-4 py-2.5 text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />

        {loading ? (
          <p className="font-body text-sm text-text-muted">Searching…</p>
        ) : (
          <div className="space-y-5">
            {renderGroup('Lessons', candidates.lessons)}
            {renderGroup('Challenges', candidates.challenges)}
          </div>
        )}
      </div>
    </div>
  );
}
