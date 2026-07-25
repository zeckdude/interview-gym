'use client';

interface AiConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AiConfirmationModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: AiConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
        className="relative bg-bg-surface rounded-xl border border-border-subtle shadow-modal p-6 max-w-md w-full space-y-5"
      >
        <h2
          id="ai-modal-title"
          className="font-display font-bold text-xl text-text-primary"
        >
          {title}
        </h2>
        <p className="font-body text-base text-text-primary leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="font-body font-semibold px-5 py-2.5 rounded-md bg-bg-subtle hover:bg-bg-muted text-text-primary border border-border-subtle transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="font-body font-semibold px-5 py-2.5 rounded-md bg-brand hover:bg-brand-dark text-white transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
