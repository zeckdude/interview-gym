'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ChallengeNoteSectionProps {
  challengeId: string;
  initialContent?: string;
  initialUpdatedAt?: string;
}

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ChallengeNoteSection({
  challengeId,
  initialContent = '',
  initialUpdatedAt,
}: ChallengeNoteSectionProps) {
  const [note, setNote] = useState(initialContent);
  const [savedAt, setSavedAt] = useState<string | null>(initialUpdatedAt ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNote(initialContent);
    setSavedAt(initialUpdatedAt ?? null);
  }, [challengeId, initialContent, initialUpdatedAt]);

  const saveNote = useCallback(async () => {
    const trimmed = note.trim();
    if (!trimmed) return;

    setSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, content: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedAt(data.note.updatedAt);
      }
    } finally {
      setSaving(false);
    }
  }, [challengeId, note]);

  return (
    <div className="mt-6 border-t border-border-subtle pt-6">
      <h3 className="font-display text-base font-bold text-text-primary mb-2">
        📝 Your Note
      </h3>
      <p className="font-body text-sm text-text-secondary mb-3">
        Leave yourself a breadcrumb — something you&apos;ll want to remember when this
        comes back up for review.
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
        placeholder="e.g., Remember: .reduce() needs an initial value or it'll skip the first element..."
        className="w-full bg-bg-surface border border-border-subtle rounded-md px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted resize-none h-24 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="font-body text-xs text-text-muted">{note.length}/500</span>
        <Button
          variant="secondary"
          className="px-4 py-2 text-sm"
          onClick={saveNote}
          disabled={!note.trim() || saving}
        >
          {saving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>
      {savedAt && (
        <p className="font-body text-xs text-success mt-1">
          ✓ Saved {formatSavedAt(savedAt)}
        </p>
      )}
    </div>
  );
}
