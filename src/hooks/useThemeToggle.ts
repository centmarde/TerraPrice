import { useTheme } from '../contexts/ThemeContext';

/**
 * A simple hook that provides theme utilities
 * 
 * Usage:
 * const { theme, toggleTheme, setTheme, isDark, isLight } = useThemeToggle();
 */
export function useThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  
  return {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    isLight
  };
}
