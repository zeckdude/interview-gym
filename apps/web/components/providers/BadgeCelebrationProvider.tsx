'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export interface BadgeToast {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string;
}

interface BadgeCelebrationContextValue {
  showBadges: (badges: Omit<BadgeToast, 'id'>[]) => void;
}

const BadgeCelebrationContext = createContext<BadgeCelebrationContextValue | null>(null);

const TOAST_DURATION_MS = 4000;

function BadgeToastItem({ badge, onDismiss }: { badge: BadgeToast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className="animate-slide-up bg-bg-surface border border-brand/30 rounded-xl shadow-raised p-5 max-w-sm w-full"
    >
      <p className="font-display font-bold text-brand text-sm mb-2">🎉 New Badge Unlocked!</p>
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{badge.emoji}</span>
        <div>
          <p className="font-display font-bold text-text-primary text-base">{badge.name}</p>
          <p className="font-body text-sm text-text-primary mt-1">{badge.description}</p>
        </div>
      </div>
    </div>
  );
}

export function BadgeCelebrationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<BadgeToast[]>([]);

  const showBadges = useCallback((badges: Omit<BadgeToast, 'id'>[]) => {
    const newToasts = badges.map((b) => ({
      ...b,
      id: `${b.slug}-${Date.now()}-${Math.random()}`,
    }));
    setToasts((prev) => [...prev, ...newToasts]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <BadgeCelebrationContext.Provider value={{ showBadges }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 items-center pointer-events-none"
      >
        {toasts.map((toast) => (
          <BadgeToastItem
            key={toast.id}
            badge={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </BadgeCelebrationContext.Provider>
  );
}

export function useBadgeCelebration() {
  const ctx = useContext(BadgeCelebrationContext);
  if (!ctx) {
    throw new Error('useBadgeCelebration must be used within BadgeCelebrationProvider');
  }
  return ctx;
}

/** Safe hook that no-ops outside provider (for optional usage). */
export function useBadgeCelebrationOptional() {
  return useContext(BadgeCelebrationContext);
}
