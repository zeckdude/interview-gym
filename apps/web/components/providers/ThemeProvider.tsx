'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Look } from '@/lib/themes/types';
import { getLookById, DEFAULT_LOOK_ID } from '@/lib/themes/registry';
import { applyTheme } from '@/lib/themes/apply-theme';

type DarkMode = 'light' | 'dark';

interface ThemeContextValue {
  look: Look;
  darkMode: DarkMode;
  setLook: (lookId: string) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  look: getLookById(DEFAULT_LOOK_ID),
  darkMode: 'light',
  setLook: () => {},
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [lookId, setLookId] = useState(DEFAULT_LOOK_ID);
  const [darkMode, setDarkMode] = useState<DarkMode>('light');

  useEffect(() => {
    const storedLook = localStorage.getItem('ig-look') ?? DEFAULT_LOOK_ID;
    const storedDark = localStorage.getItem('ig-dark');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark: DarkMode = storedDark
      ? (storedDark as DarkMode)
      : systemDark
        ? 'dark'
        : 'light';
    setLookId(storedLook);
    setDarkMode(initialDark);
    const look = getLookById(storedLook);
    applyTheme(initialDark === 'dark' ? look.dark : look.light);
    document.documentElement.classList.toggle('dark', initialDark === 'dark');
  }, []);

  const setLook = (id: string) => {
    const look = getLookById(id);
    setLookId(id);
    localStorage.setItem('ig-look', id);
    applyTheme(darkMode === 'dark' ? look.dark : look.light);
  };

  const toggleDarkMode = () => {
    const next: DarkMode = darkMode === 'light' ? 'dark' : 'light';
    setDarkMode(next);
    localStorage.setItem('ig-dark', next);
    const look = getLookById(lookId);
    applyTheme(next === 'dark' ? look.dark : look.light);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{ look: getLookById(lookId), darkMode, setLook, toggleDarkMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
