import { TextStyle } from 'react-native';
import { COLORS } from '@/constants';

// Design token interfaces
export interface ColorPalette {
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
}

export interface ThemeColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  gray: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  body: TextStyle;
  bodyLarge: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ThemeShadows {
  sm: ThemeShadow;
  md: ThemeShadow;
  lg: ThemeShadow;
  xl: ThemeShadow;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

// Enhanced theme configuration with design tokens
export const theme: Theme = {
  colors: {
    primary: {
      '50': '#E3F2FD',
      '100': '#BBDEFB',
      '200': '#90CAF9',
      '300': '#64B5F6',
      '400': '#42A5F5',
      '500': COLORS.PRIMARY, // #007AFF
      '600': '#1976D2',
      '700': '#1565C0',
      '800': '#0D47A1',
      '900': '#0A3D91',
    },
    secondary: {
      '50': '#F3E5F5',
      '100': '#E1BEE7',
      '200': '#CE93D8',
      '300': '#BA68C8',
      '400': '#AB47BC',
      '500': COLORS.SECONDARY, // #5856D6
      '600': '#8E24AA',
      '700': '#7B1FA2',
      '800': '#6A1B9A',
      '900': '#4A148C',
    },
    gray: {
      '50': '#F9FAFB',
      '100': '#F3F4F6',
      '200': '#E5E7EB',
      '300': '#D1D5DB',
      '400': '#9CA3AF',
      '500': '#6B7280',
      '600': '#4B5563',
      '700': '#374151',
      '800': '#1F2937',
      '900': '#111827',
    },
    success: {
      '50': '#F0FDF4',
      '100': '#DCFCE7',
      '200': '#BBF7D0',
      '300': '#86EFAC',
      '400': '#4ADE80',
      '500': COLORS.SUCCESS, // #34C759
      '600': '#16A34A',
      '700': '#15803D',
      '800': '#166534',
      '900': '#14532D',
    },
    warning: {
      '50': '#FFFBEB',
      '100': '#FEF3C7',
      '200': '#FDE68A',
      '300': '#FCD34D',
      '400': '#FBBF24',
      '500': COLORS.WARNING, // #FF9500
      '600': '#D97706',
      '700': '#B45309',
      '800': '#92400E',
      '900': '#78350F',
    },
    error: {
      '50': '#FEF2F2',
      '100': '#FEE2E2',
      '200': '#FECACA',
      '300': '#FCA5A5',
      '400': '#F87171',
      '500': COLORS.ERROR, // #FF3B30
      '600': '#DC2626',
      '700': '#B91C1C',
      '800': '#991B1B',
      '900': '#7F1D1D',
    },
    background: COLORS.BACKGROUND,
    surface: COLORS.SURFACE,
    text: COLORS.TEXT_PRIMARY,
    textSecondary: COLORS.TEXT_SECONDARY,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 36,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Theme context and provider
import * as React from 'react';
import { createContext, useContext, ReactNode } from 'react';

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

  return React.createElement(
    ThemeContext.Provider,
    { value: contextValue },
    children
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

// Utility functions for theme-based styling
export const createThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return (currentTheme: Theme): T => styleFactory(currentTheme);
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper function to get spacing value
export const getSpacing = (theme: Theme, size: keyof ThemeSpacing): number => {
  return theme.spacing[size];
};

// Helper function to get multiple spacing values
export const getSpacingMultiple = (
  theme: Theme,
  ...sizes: (keyof ThemeSpacing)[]
): number[] => {
  return sizes.map((size) => theme.spacing[size]);
};

// Helper function to create consistent padding/margin
export const createSpacing = (theme: Theme) => ({
  p: (size: keyof ThemeSpacing) => ({ padding: theme.spacing[size] }),
  px: (size: keyof ThemeSpacing) => ({
    paddingHorizontal: theme.spacing[size],
  }),
  py: (size: keyof ThemeSpacing) => ({
    paddingVertical: theme.spacing[size],
  }),
  pt: (size: keyof ThemeSpacing) => ({ paddingTop: theme.spacing[size] }),
  pb: (size: keyof ThemeSpacing) => ({ paddingBottom: theme.spacing[size] }),
  pl: (size: keyof ThemeSpacing) => ({ paddingLeft: theme.spacing[size] }),
  pr: (size: keyof ThemeSpacing) => ({ paddingRight: theme.spacing[size] }),
  m: (size: keyof ThemeSpacing) => ({ margin: theme.spacing[size] }),
  mx: (size: keyof ThemeSpacing) => ({
    marginHorizontal: theme.spacing[size],
  }),
  my: (size: keyof ThemeSpacing) => ({
    marginVertical: theme.spacing[size],
  }),
  mt: (size: keyof ThemeSpacing) => ({ marginTop: theme.spacing[size] }),
  mb: (size: keyof ThemeSpacing) => ({ marginBottom: theme.spacing[size] }),
  ml: (size: keyof ThemeSpacing) => ({ marginLeft: theme.spacing[size] }),
  mr: (size: keyof ThemeSpacing) => ({ marginRight: theme.spacing[size] }),
});

// Helper function to get typography styles
export const getTypographyStyle = (
  theme: Theme,
  variant: keyof ThemeTypography
): TextStyle => {
  return theme.typography[variant];
};

// Helper function to create responsive styles
export const createResponsiveStyle = (
  theme: Theme,
  baseStyle: any,
  breakpoints?: { tablet?: any; desktop?: any }
) => {
  // For now, return base style
  // This can be enhanced with actual responsive logic based on screen dimensions
  return baseStyle;
};

// Export default theme instance
export default theme;

// Re-export utilities
export * from './utils';
