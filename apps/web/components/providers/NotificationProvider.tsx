'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';
import { registerServiceWorker } from '@/lib/push-client';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const [toast, setToast] = useState<AppNotification | null>(null);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR<NotificationsResponse>(
    isSignedIn ? '/api/notifications' : null,
    fetcher,
    { refreshInterval: 10000 }
  );

  useEffect(() => {
    if (isSignedIn) {
      void registerServiceWorker();
    }
  }, [isSignedIn]);

  useEffect(() => {
    const latest = data?.notifications[0];
    if (!latest || latest.read) return;

    if (lastSeenId === null) {
      setLastSeenId(latest.id);
      return;
    }

    if (latest.id !== lastSeenId) {
      setLastSeenId(latest.id);
      setToast(latest);
    }
  }, [data?.notifications, lastSeenId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(timer);
  }, [toast]);

  const markRead = useCallback(
    async (id: string) => {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      await mutate();
    },
    [mutate]
  );

  const markAllRead = useCallback(async () => {
    await fetch('/api/notifications', { method: 'PATCH' });
    await mutate();
  }, [mutate]);

  const value = useMemo(
    () => ({
      notifications: data?.notifications ?? [],
      unreadCount: data?.unreadCount ?? 0,
      isLoading,
      markRead,
      markAllRead,
      refresh: () => void mutate(),
    }),
    [data, isLoading, markRead, markAllRead, mutate]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-bg-surface border border-brand/30 shadow-raised rounded-xl p-4 animate-in slide-in-from-bottom-4">
          <p className="font-display font-bold text-sm text-text-primary mb-1">
            {toast.title}
          </p>
          <p className="font-body text-sm text-text-secondary mb-3">{toast.body}</p>
          <div className="flex gap-2">
            {toast.href && (
              <a
                href={toast.href}
                onClick={() => {
                  void markRead(toast.id);
                  setToast(null);
                }}
                className="font-body text-xs font-semibold px-3 py-1.5 rounded-md bg-brand text-white hover:bg-brand-dark"
              >
                View
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                void markRead(toast.id);
                setToast(null);
              }}
              className="font-body text-xs font-semibold px-3 py-1.5 rounded-md bg-bg-subtle text-text-secondary hover:text-text-primary"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}

export function useNotificationsOptional() {
  return useContext(NotificationContext);
}
