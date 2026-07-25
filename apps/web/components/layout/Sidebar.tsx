'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { cn } from '@/lib/utils';
import { useRightPanel } from '@/components/providers/RightPanelProvider';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/study-plan', label: 'Study Plan', icon: '📋' },
  { href: '/lessons', label: 'Lessons', icon: '📚' },
  { href: '/challenges', label: 'Challenges', icon: '💪' },
  { href: '/generate', label: 'Generate Challenge', icon: '✨' },
  { href: '/my-challenges', label: 'My Challenges', icon: '📁' },
  { href: '/questions', label: 'Questions', icon: '🧠' },
  { href: '/simulator', label: 'Simulator', icon: '🎯' },
  { href: '/leaderboard', label: 'My Bests', icon: '🏆' },
  { href: '/notes', label: 'My Notes', icon: '📝' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

interface StreakData {
  currentStreak: number;
  freezesAvailable?: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useRightPanel();
  const { data: streakData } = useSWR<StreakData>('/api/streak', fetcher, {
    refreshInterval: 60000,
  });

  const streak = streakData?.currentStreak ?? 0;
  const streakEmoji = streak > 0 ? '🔥' : '✨';

  return (
    <aside className="app-sidebar fixed left-0 top-0 h-screen bg-bg-inverse flex flex-col z-20 overflow-hidden">
      {/* Logo */}
      <div className={cn('flex items-center gap-2 py-5 flex-shrink-0', sidebarCollapsed ? 'justify-center px-2' : 'px-6')}>
        <span className="text-2xl flex-shrink-0">🏋️</span>
        {!sidebarCollapsed && (
          <span className="font-display font-bold text-xl text-text-inverse tracking-tight whitespace-nowrap">
            Interview <span className="text-brand">Gym</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className={cn('flex-1 py-4 space-y-1', sidebarCollapsed ? 'px-2' : 'px-3')}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-md font-body text-sm transition-all duration-150',
                sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-brand text-white shadow-brand'
                  : 'text-text-inverse hover:bg-white/10'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'flex items-center text-text-muted hover:text-text-inverse hover:bg-white/10 transition-all duration-150 rounded-md mx-2 mb-2 py-2',
          sidebarCollapsed ? 'justify-center px-2' : 'gap-2 px-3'
        )}
      >
        <span className="text-sm">{sidebarCollapsed ? '→' : '←'}</span>
        {!sidebarCollapsed && <span className="font-body text-xs">Collapse</span>}
      </button>

      {/* Streak */}
      <div className={cn('border-t border-white/10 py-4 mt-auto', sidebarCollapsed ? 'px-2 flex justify-center' : 'px-4')}>
        {sidebarCollapsed ? (
          <span className="text-xl" title={`${streak} day streak`}>{streakEmoji}</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{streakEmoji}</span>
            <div>
              <p className="font-body font-bold text-text-inverse text-sm">
                {streak} day streak
              </p>
              <p className="font-body text-text-muted text-xs">Keep it going!</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
