import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('finaura-theme', 'dark');
  }, []);

  const toggleTheme = () => {}; // No-op

  return { theme, toggleTheme };
}
