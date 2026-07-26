'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PLAYBOOK_CATEGORIES } from '@/lib/playbook/categories';

const PLAYBOOK_LAUNCH_STORAGE_KEY = 'playbook-simulator-launch';

interface PlaybookEntry {
  id: string;
  category: string;
  title: string;
  questionPrompt: string | null;
}

interface LaunchSimulatedInterviewModalProps {
  entries: PlaybookEntry[];
  onClose: () => void;
}

export function LaunchSimulatedInterviewModal({
  entries,
  onClose,
}: LaunchSimulatedInterviewModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const map = new Map<string, PlaybookEntry[]>();
    for (const entry of entries) {
      if (!entry.questionPrompt) continue;
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return map;
  }, [entries]);

  const selectableEntries = entries.filter((e) => e.questionPrompt);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllInCategory = (category: string) => {
    const ids = grouped.get(category)?.map((e) => e.id) ?? [];
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
  };

  const launch = () => {
    const prompts = selectableEntries
      .filter((e) => selected.has(e.id))
      .map((e) => e.questionPrompt!)
      .filter(Boolean);

    sessionStorage.setItem(
      PLAYBOOK_LAUNCH_STORAGE_KEY,
      JSON.stringify({ questions: prompts, entryIds: Array.from(selected) })
    );
    router.push('/simulator/voice?playbook=true');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-bg-surface rounded-xl shadow-modal max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border-subtle space-y-2">
          <h2 className="font-display font-bold text-xl text-text-primary">
            🎯 Launch Simulated Interview
          </h2>
          <p className="font-body text-base text-text-primary leading-relaxed">
            Select entries whose <strong>interview questions</strong> you want to practice. The
            simulator grades what you say live — your Playbook answers stay private.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {selectableEntries.length === 0 ? (
            <p className="font-body text-base text-text-primary">
              No entries with interview questions yet. Add entries in your Playbook first.
            </p>
          ) : (
            PLAYBOOK_CATEGORIES.map((cat) => {
              const catEntries = grouped.get(cat.id);
              if (!catEntries?.length) return null;
              return (
                <section key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-base text-text-primary">
                      {cat.icon} {cat.label}
                    </h3>
                    <button
                      type="button"
                      onClick={() => selectAllInCategory(cat.id)}
                      className="font-body text-xs text-brand hover:underline"
                    >
                      Select all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {catEntries.map((entry) => (
                      <label
                        key={entry.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selected.has(entry.id)
                            ? 'border-brand bg-brand-light'
                            : 'border-border-subtle hover:border-brand'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(entry.id)}
                          onChange={() => toggle(entry.id)}
                          className="mt-1 w-4 h-4 rounded border-border-subtle text-brand"
                        />
                        <div className="space-y-1 min-w-0">
                          <p className="font-body text-sm font-semibold text-text-primary">
                            {entry.title}
                          </p>
                          <p className="font-body text-sm text-text-muted">
                            Q: {entry.questionPrompt}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>

        <div className="p-6 border-t border-border-subtle flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={launch} disabled={selected.size === 0}>
            Launch ({selected.size} selected) →
          </Button>
        </div>
      </div>
    </div>
  );
}
