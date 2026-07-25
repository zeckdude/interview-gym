'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useNotificationsOptional } from '@/components/providers/NotificationProvider';
import { isPushSupported, subscribeToPushNotifications } from '@/lib/push-client';

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const ctx = useNotificationsOptional();
  const [open, setOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!ctx) return null;

  const { notifications, unreadCount, markRead, markAllRead } = ctx;

  const handleEnablePush = async () => {
    setPushLoading(true);
    try {
      const ok = await subscribeToPushNotifications();
      setPushEnabled(ok);
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-md bg-bg-subtle hover:bg-brand-light border border-border-subtle hover:border-brand/30 transition-all flex items-center justify-center"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg-surface border border-border-subtle shadow-raised rounded-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-subtle">
            <p className="font-display font-bold text-sm text-text-primary">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="font-body text-xs font-semibold text-brand hover:text-brand-dark"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="font-body text-sm text-text-muted text-center py-8 px-4">
                No notifications yet. When a challenge finishes generating, it will show up here.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border-subtle last:border-b-0 ${
                    n.read ? 'bg-bg-surface' : 'bg-brand-light/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-body font-semibold text-sm text-text-primary">{n.title}</p>
                    <span className="font-body text-xs text-text-muted whitespace-nowrap">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="font-body text-sm text-text-secondary mb-2">{n.body}</p>
                  {n.href && (
                    <Link
                      href={n.href}
                      onClick={() => {
                        void markRead(n.id);
                        setOpen(false);
                      }}
                      className="font-body text-xs font-semibold text-brand hover:text-brand-dark"
                    >
                      Open →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          {isPushSupported() && !pushEnabled && (
            <div className="px-4 py-3 border-t border-border-subtle bg-bg-subtle">
              <p className="font-body text-xs text-text-secondary mb-2">
                Get browser push alerts when generation finishes — even if you navigate away.
              </p>
              <button
                type="button"
                onClick={() => void handleEnablePush()}
                disabled={pushLoading}
                className="font-body text-xs font-semibold px-3 py-1.5 rounded-md bg-brand text-white hover:bg-brand-dark disabled:opacity-50"
              >
                {pushLoading ? 'Enabling…' : 'Enable push notifications'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
