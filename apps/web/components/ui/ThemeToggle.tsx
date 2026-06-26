'use client';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="w-9 h-9 rounded-full bg-bg-subtle hover:bg-border-subtle dark:bg-bg-subtle dark:hover:bg-border-subtle flex items-center justify-center transition-all duration-150"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
