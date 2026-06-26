'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/challenges', label: 'Challenges', icon: '💪' },
  { href: '#', label: 'Lessons', icon: '📚', disabled: true },
  { href: '#', label: 'Simulator', icon: '⏱️', disabled: true },
];

interface StreakData {
  currentStreak: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Sidebar() {
  const pathname = usePathname();
  const { data: streakData } = useSWR<StreakData>('/api/streak', fetcher, {
    refreshInterval: 60000,
  });

  const streak = streakData?.currentStreak ?? 0;
  const streakEmoji = streak > 0 ? '🔥' : '✨';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-inverse dark:bg-black flex flex-col z-20">
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="text-2xl">🏋️</span>
        <span className="font-display font-bold text-xl text-text-inverse tracking-tight">
          Interview <span className="text-brand">Gym</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href !== '#' &&
            (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-muted cursor-not-allowed"
                title="Coming in a future phase"
              >
                <span>{item.icon}</span>
                <span className="font-body text-sm">{item.label}</span>
                <span className="ml-auto text-xs bg-bg-subtle/20 px-1.5 py-0.5 rounded-sm">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md font-body text-sm transition-all duration-150',
                isActive
                  ? 'bg-brand text-white shadow-brand'
                  : 'text-text-inverse hover:bg-white/10'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs font-body text-text-muted">Current streak</p>
        <p className="font-display font-bold text-2xl text-text-inverse">
          {streak} <span className="text-lg">{streakEmoji}</span>
        </p>
      </div>
    </aside>
  );
}
