'use client';

import { Button } from '@/components/ui/Button';

interface NoteHintModalProps {
  open: boolean;
  onClose: () => void;
  onShowNote: () => void;
}

export function NoteHintModal({ open, onClose, onShowNote }: NoteHintModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-bg-surface rounded-xl border border-border-subtle shadow-modal max-w-md w-full"
      >
        <div className="text-center p-6">
          <span className="text-4xl mb-4 block">🤔</span>
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">
            Are you sure you want to peek?
          </h2>
          <p className="font-body text-sm text-text-secondary mb-6">
            Viewing your note means you&apos;re using a hint. This attempt won&apos;t count
            as a clean pass — but that&apos;s okay if you&apos;re truly stuck.
          </p>
          <p className="font-body text-xs text-text-muted mb-6 italic">
            Real talk: try it without the note first. You might surprise yourself.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={onClose}>
              Try Without It
            </Button>
            <Button variant="secondary" onClick={onShowNote}>
              Show My Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NoteHintBannerProps {
  onViewNote: () => void;
}

export function NoteHintBanner({ onViewNote }: NoteHintBannerProps) {
  return (
    <div className="mb-4 p-4 bg-warning-light border border-warning rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>💡</span>
          <p className="font-body text-sm font-semibold text-text-primary">
            You left yourself a note on this one
          </p>
        </div>
        <Button variant="ghost" className="px-4 py-2 text-sm shrink-0" onClick={onViewNote}>
          View Note
        </Button>
      </div>
    </div>
  );
}

interface RevealedNoteCardProps {
  content: string;
}

export function RevealedNoteCard({ content }: RevealedNoteCardProps) {
  return (
    <div className="mb-4 p-4 bg-bg-subtle border-l-4 border-warning rounded-r-lg">
      <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
        Your note (hint used)
      </p>
      <p className="font-body text-sm text-text-primary whitespace-pre-wrap">{content}</p>
    </div>
  );
}
