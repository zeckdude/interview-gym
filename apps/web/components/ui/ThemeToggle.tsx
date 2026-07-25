'use client';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${darkMode === 'light' ? 'dark' : 'light'} mode`}
      className="w-9 h-9 rounded-full bg-bg-subtle hover:bg-border-subtle flex items-center justify-center transition-all duration-150"
    >
      {darkMode === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
