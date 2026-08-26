'use client';

import { cn } from '@/lib/utils';
import type { PathType } from '@/lib/paths/types';
import { PATH_TYPE_DESCRIPTIONS, PATH_TYPE_LABELS } from '@/lib/paths/types';

const PATH_ICONS: Record<PathType, string> = {
  fe: '🎨',
  be: '🖥️',
  fullstack: '🔄',
};

interface CreatePathModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (type: PathType, name: string) => Promise<void>;
  creating: boolean;
}

export function CreatePathModal({ open, onClose, onCreate, creating }: CreatePathModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="w-full max-w-lg rounded-xl bg-bg-surface border border-border-subtle shadow-modal max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="create-path-title"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const name = String(formData.get('name') ?? '').trim();
            const type = String(formData.get('type') ?? '') as PathType;
            if (!name || !type) return;
            await onCreate(type, name);
          }}
          className="p-6 space-y-6"
        >
          <div>
            <h2
              id="create-path-title"
              className="font-display font-bold text-2xl text-text-primary"
            >
              Create a New Path
            </h2>
            <p className="font-body text-sm text-text-secondary mt-1">
              Pick a focus area and give this path a name.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="path-name" className="font-body text-sm font-semibold text-text-primary">
              What are you preparing for?
            </label>
            <input
              id="path-name"
              name="name"
              type="text"
              required
              placeholder='e.g. "Google Interview" or "General FE Prep"'
              className="w-full px-4 py-3 rounded-md border border-border-subtle bg-bg-base font-body text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="font-body text-sm font-semibold text-text-primary">
              Choose your path type
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['fe', 'be', 'fullstack'] as const).map((type) => (
                <label
                  key={type}
                  className={cn(
                    'relative flex flex-col items-center text-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                    'border-border-subtle hover:border-brand/50 has-[:checked]:border-brand has-[:checked]:bg-brand-light'
                  )}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    required
                    defaultChecked={type === 'fe'}
                    className="sr-only"
                  />
                  <span className="text-3xl mb-2">{PATH_ICONS[type]}</span>
                  <span className="font-display font-bold text-base text-text-primary">
                    {PATH_TYPE_LABELS[type]}
                  </span>
                  <span className="font-body text-xs text-text-secondary mt-1 leading-snug">
                    {PATH_TYPE_DESCRIPTIONS[type]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 px-4 py-3 rounded-md border border-border-subtle font-body text-sm font-semibold text-text-primary hover:bg-bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-3 rounded-md bg-brand text-white font-body text-sm font-semibold shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create Path →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
