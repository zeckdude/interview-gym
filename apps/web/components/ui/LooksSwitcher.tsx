'use client';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { LOOKS } from '@/lib/themes/registry';

export function LooksSwitcher() {
  const { look, setLook } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Change app look"
        title="Change Look"
        className="w-9 h-9 rounded-full bg-bg-subtle hover:bg-border-subtle flex items-center justify-center transition-all duration-150"
      >
        🎨
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 bg-bg-surface rounded-xl shadow-modal border border-border-subtle p-4">
            <div className="mb-4">
              <h3 className="font-display font-bold text-text-primary text-base">
                Choose Your Look
              </h3>
              <p className="font-body text-xs text-text-muted mt-0.5">
                Swap the vibe. Your progress stays the same.
              </p>
            </div>

            <div className="space-y-2">
              {LOOKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLook(l.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center gap-3 ${
                    look.id === l.id
                      ? 'border-brand bg-brand-light'
                      : 'border-border-subtle bg-bg-subtle hover:border-brand hover:bg-brand-light'
                  }`}
                >
                  <div className="flex gap-1 flex-shrink-0">
                    <div
                      className="w-6 h-10 rounded-md border border-border-subtle"
                      style={{ backgroundColor: l.previewColor }}
                    />
                    <div
                      className="w-6 h-10 rounded-md"
                      style={{ backgroundColor: l.previewAccent }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-text-primary">
                        {l.name}
                      </span>
                      {look.id === l.id && (
                        <span className="text-xs font-body font-semibold text-brand bg-brand-light px-1.5 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-text-secondary mt-0.5 leading-snug">
                      {l.tagline}
                    </p>
                  </div>
                  {look.id === l.id && (
                    <span className="text-brand text-lg flex-shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>

            <p className="font-body text-xs text-text-muted mt-4 text-center">
              More looks coming soon 👀
            </p>
          </div>
        </>
      )}
    </div>
  );
}
