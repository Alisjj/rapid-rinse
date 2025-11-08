import React, { createContext, useContext, ReactNode } from 'react';
import { Theme, theme } from './index';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  isDark?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = theme,
  isDark = false,
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(initialTheme);
  const [darkMode, setDarkMode] = React.useState<boolean>(isDark);

  const toggleTheme = React.useCallback(() => {
    setDarkMode((prev) => !prev);
    // Here you could implement dark theme switching logic
    // For now, we'll keep the same theme but track the preference
  }, []);

  const contextValue = React.useMemo(
    () => ({
      theme: currentTheme,
      isDark: darkMode,
      toggleTheme,
    }),
    [currentTheme, darkMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
