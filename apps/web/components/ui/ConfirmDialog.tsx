'use client';

import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        disabled={loading}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className={cn(
          'relative bg-bg-surface rounded-xl border shadow-modal p-6 max-w-md w-full space-y-5',
          destructive ? 'border-error/40' : 'border-border-subtle'
        )}
      >
        <div className="space-y-2">
          <h2
            id="confirm-dialog-title"
            className="font-display font-bold text-xl text-text-primary"
          >
            {title}
          </h2>
          {destructive && (
            <p className="font-body text-sm font-semibold text-error">This action cannot be undone.</p>
          )}
        </div>
        <p className="font-body text-base text-text-primary leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="font-body font-semibold px-5 py-2.5 rounded-md bg-bg-subtle hover:bg-border-subtle text-text-primary border border-border-subtle transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'font-body font-semibold px-5 py-2.5 rounded-md text-white transition-colors disabled:opacity-50',
              destructive
                ? 'bg-error hover:bg-error/90'
                : 'bg-brand hover:bg-brand-dark'
            )}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
