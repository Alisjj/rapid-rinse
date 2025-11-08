import { ViewStyle, TextStyle } from 'react-native';
import { Theme, ThemeSpacing, ThemeTypography, ColorPalette } from './index';

// Utility functions for theme-based styling

/**
 * Creates a style object with theme-based values
 */
export const createStyle = (theme: Theme) => ({
  // Color utilities
  color: {
    primary: (shade: keyof ColorPalette = '500') => ({
      color: theme.colors.primary[shade],
    }),
    secondary: (shade: keyof ColorPalette = '500') => ({
      color: theme.colors.secondary[shade],
    }),
    success: (shade: keyof ColorPalette = '500') => ({
      color: theme.colors.success[shade],
    }),
    warning: (shade: keyof ColorPalette = '500') => ({
      color: theme.colors.warning[shade],
    }),
    error: (shade: keyof ColorPalette = '500') => ({
      color: theme.colors.error[shade],
    }),
    gray: (shade: keyof ColorPalette = '500') => ({
      color: theme.colors.gray[shade],
    }),
    text: () => ({ color: theme.colors.text }),
    textSecondary: () => ({ color: theme.colors.textSecondary }),
  },

  // Background color utilities
  bg: {
    primary: (shade: keyof ColorPalette = '500') => ({
      backgroundColor: theme.colors.primary[shade],
    }),
    secondary: (shade: keyof ColorPalette = '500') => ({
      backgroundColor: theme.colors.secondary[shade],
    }),
    success: (shade: keyof ColorPalette = '500') => ({
      backgroundColor: theme.colors.success[shade],
    }),
    warning: (shade: keyof ColorPalette = '500') => ({
      backgroundColor: theme.colors.warning[shade],
    }),
    error: (shade: keyof ColorPalette = '500') => ({
      backgroundColor: theme.colors.error[shade],
    }),
    gray: (shade: keyof ColorPalette = '500') => ({
      backgroundColor: theme.colors.gray[shade],
    }),
    surface: () => ({ backgroundColor: theme.colors.surface }),
    background: () => ({ backgroundColor: theme.colors.background }),
  },

  // Border utilities
  border: {
    primary: (shade: keyof ColorPalette = '500') => ({
      borderColor: theme.colors.primary[shade],
    }),
    secondary: (shade: keyof ColorPalette = '500') => ({
      borderColor: theme.colors.secondary[shade],
    }),
    gray: (shade: keyof ColorPalette = '300') => ({
      borderColor: theme.colors.gray[shade],
    }),
    width: (width: number = 1) => ({ borderWidth: width }),
    radius: (size: keyof typeof theme.borderRadius) => ({
      borderRadius: theme.borderRadius[size],
    }),
  },

  // Typography utilities
  text: {
    h1: () => theme.typography.h1,
    h2: () => theme.typography.h2,
    h3: () => theme.typography.h3,
    h4: () => theme.typography.h4,
    body: () => theme.typography.body,
    bodyLarge: () => theme.typography.bodyLarge,
    caption: () => theme.typography.caption,
    button: () => theme.typography.button,
    center: () => ({ textAlign: 'center' as const }),
    left: () => ({ textAlign: 'left' as const }),
    right: () => ({ textAlign: 'right' as const }),
  },

  // Spacing utilities (already defined in main theme file, but adding for completeness)
  spacing: createSpacing(theme),

  // Shadow utilities
  shadow: {
    sm: () => theme.shadows.sm,
    md: () => theme.shadows.md,
    lg: () => theme.shadows.lg,
    xl: () => theme.shadows.xl,
  },

  // Layout utilities
  layout: {
    flex: (value: number = 1) => ({ flex: value }),
    flexRow: () => ({ flexDirection: 'row' as const }),
    flexCol: () => ({ flexDirection: 'column' as const }),
    center: () => ({
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    }),
    centerX: () => ({ alignItems: 'center' as const }),
    centerY: () => ({ justifyContent: 'center' as const }),
    spaceBetween: () => ({ justifyContent: 'space-between' as const }),
    spaceAround: () => ({ justifyContent: 'space-around' as const }),
    spaceEvenly: () => ({ justifyContent: 'space-evenly' as const }),
    absolute: () => ({ position: 'absolute' as const }),
    relative: () => ({ position: 'relative' as const }),
  },
});

/**
 * Helper function to create spacing utilities
 */
export const createSpacing = (theme: Theme) => ({
  p: (size: keyof ThemeSpacing) => ({ padding: theme.spacing[size] }),
  px: (size: keyof ThemeSpacing) => ({
    paddingHorizontal: theme.spacing[size],
  }),
  py: (size: keyof ThemeSpacing) => ({ paddingVertical: theme.spacing[size] }),
  pt: (size: keyof ThemeSpacing) => ({ paddingTop: theme.spacing[size] }),
  pb: (size: keyof ThemeSpacing) => ({ paddingBottom: theme.spacing[size] }),
  pl: (size: keyof ThemeSpacing) => ({ paddingLeft: theme.spacing[size] }),
  pr: (size: keyof ThemeSpacing) => ({ paddingRight: theme.spacing[size] }),
  m: (size: keyof ThemeSpacing) => ({ margin: theme.spacing[size] }),
  mx: (size: keyof ThemeSpacing) => ({ marginHorizontal: theme.spacing[size] }),
  my: (size: keyof ThemeSpacing) => ({ marginVertical: theme.spacing[size] }),
  mt: (size: keyof ThemeSpacing) => ({ marginTop: theme.spacing[size] }),
  mb: (size: keyof ThemeSpacing) => ({ marginBottom: theme.spacing[size] }),
  ml: (size: keyof ThemeSpacing) => ({ marginLeft: theme.spacing[size] }),
  mr: (size: keyof ThemeSpacing) => ({ marginRight: theme.spacing[size] }),
});

/**
 * Combines multiple style objects
 */
export const combineStyles = (
  ...styles: (ViewStyle | TextStyle | undefined)[]
): ViewStyle | TextStyle => {
  return Object.assign({}, ...styles.filter(Boolean));
};

/**
 * Creates a style factory function that receives theme as parameter
 */
export const makeStyles = <T extends Record<string, ViewStyle | TextStyle>>(
  styleFactory: (theme: Theme) => T
) => {
  return (theme: Theme): T => styleFactory(theme);
};

/**
 * Helper to get color value from theme with optional opacity
 */
export const getThemeColor = (
  theme: Theme,
  colorPath: string,
  opacity?: number
): string => {
  const pathArray = colorPath.split('.');
  let color: any = theme.colors;

  for (const key of pathArray) {
    color = color[key];
    if (!color) {
      console.warn(`Color path "${colorPath}" not found in theme`);
      return theme.colors.text; // fallback
    }
  }

  if (opacity !== undefined && typeof color === 'string') {
    return getColorWithOpacity(color, opacity);
  }

  return color;
};

/**
 * Convert hex color to rgba with opacity
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Responsive helper (basic implementation)
 */
export const responsive = (
  base: ViewStyle | TextStyle,
  tablet?: ViewStyle | TextStyle,
  desktop?: ViewStyle | TextStyle
) => {
  // For now, just return base style
  // This can be enhanced with actual responsive logic
  return base;
};

/**
 * Creates consistent button styles based on variant
 */
export const createButtonStyles = (theme: Theme) => ({
  base: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  },
  primary: {
    backgroundColor: theme.colors.primary[500],
  },
  secondary: {
    backgroundColor: theme.colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: theme.colors.gray[300],
    opacity: 0.6,
  },
});

/**
 * Creates consistent card styles
 */
export const createCardStyles = (theme: Theme) => ({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
});
