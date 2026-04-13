import { useState, useEffect } from 'react';
import { DARK_MEDIA_QUERY, Theme, THEME_STORAGE_KEY, type ThemeValue } from '@/lib/constants';

function getInitialTheme(): ThemeValue {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeValue | null;
  if (stored) return stored;
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? Theme.Dark : Theme.Light;
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeValue>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.Dark);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === Theme.Dark ? Theme.Light : Theme.Dark));

  return { theme, setTheme, toggleTheme };
}
