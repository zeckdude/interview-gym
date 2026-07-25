'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import useSWR from 'swr';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LooksSwitcher } from '@/components/ui/LooksSwitcher';
import { NotificationBell } from '@/components/layout/NotificationBell';

interface HeaderProps {
  title?: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const { data: streakData } = useSWR<StreakData>('/api/streak', fetcher, {
    refreshInterval: 60000,
  });

  const streak = streakData?.currentStreak ?? 0;
  const emoji = streak > 0 ? '🔥' : '✨';
  const streakLabel = streak === 1 ? '1 day streak' : `${streak} day streak`;

  return (
    <header className="app-header fixed top-0 h-16 bg-bg-surface border-b border-border-subtle z-10 flex items-center justify-between px-6">
      <div>
        <h1 className="font-display font-bold text-lg text-text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-sm font-body">
          <span className="text-lg">{emoji}</span>
          <div className="text-right">
            <p className="font-semibold text-text-primary leading-none">{streak}</p>
            <p className="text-text-muted text-xs leading-none">day streak</p>
          </div>
        </div>
        <span className="hidden sm:block text-border-subtle">|</span>
        <span className="sm:hidden text-sm font-body text-text-secondary">
          {emoji} {streakLabel}
        </span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <LooksSwitcher />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export function AuthHeader() {
  return (
    <Link href="/" className="flex items-center gap-2 justify-center mb-8">
      <span className="text-3xl">🏋️</span>
      <span className="font-display font-bold text-2xl text-text-primary tracking-tight">
        Interview <span className="text-brand">Gym</span>
      </span>
    </Link>
  );
}
