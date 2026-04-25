import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme } from './theme';

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  const scheme = override ?? systemScheme ?? 'light';
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  function toggleTheme() {
    setOverride(prev =>
      prev === null
        ? scheme === 'dark' ? 'light' : 'dark'
        : prev === 'dark' ? 'light' : 'dark'
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme.dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
