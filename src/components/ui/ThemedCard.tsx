import React from 'react';
import {
  View,
  ViewProps,
  Text,
  TextProps,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useTheme } from '@/theme';
import { CardVariant, SpacingSize } from '@/types';

// Base Card Component
interface ThemedCardProps extends ViewProps {
  variant?: CardVariant;
  padding?: SpacingSize;
  margin?: SpacingSize;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  variant = 'default',
  padding = 'md',
  margin,
  borderRadius = 'lg',
  hoverable = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.gray['200'],
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.sm,
        };
    }
  };

  const getHoverStyles = (): ViewStyle => {
    if (!hoverable || Platform.OS !== 'web') return {};

    return {
      // @ts-ignore - web-only property
      cursor: 'pointer',
    };
  };

  const baseStyles: ViewStyle = {
    borderRadius: theme.borderRadius[borderRadius],
    padding: theme.spacing[padding],
    ...(margin && { margin: theme.spacing[margin] }),
  };

  const cardStyles: ViewStyle = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getHoverStyles(),
  };

  return (
    <View style={[cardStyles, style]} {...props}>
      {children}
    </View>
  );
};

// Card Header Component
interface CardHeaderProps extends ViewProps {
  padding?: SpacingSize;
  borderBottom?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  padding = 'md',
  borderBottom = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const headerStyles: ViewStyle = {
    paddingHorizontal: theme.spacing[padding],
    paddingVertical: theme.spacing.sm,
    ...(borderBottom && {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray['200'],
      marginBottom: theme.spacing.sm,
    }),
  };

  return (
    <View style={[headerStyles, style]} {...props}>
      {children}
    </View>
  );
};

// Card Content Component
interface CardContentProps extends ViewProps {
  padding?: SpacingSize;
}

export const CardContent: React.FC<CardContentProps> = ({
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const contentStyles: ViewStyle = {
    padding: theme.spacing[padding],
  };

  return (
    <View style={[contentStyles, style]} {...props}>
      {children}
    </View>
  );
};

// Card Title Component
interface CardTitleProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  color?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  variant = 'h3',
  color,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const titleStyles: TextStyle = {
    ...theme.typography[variant],
    color: color || theme.colors.text,
    marginBottom: theme.spacing.xs,
  };

  return (
    <Text style={[titleStyles, style]} {...props}>
      {children}
    </Text>
  );
};

// Card Footer Component
interface CardFooterProps extends ViewProps {
  padding?: SpacingSize;
  borderTop?: boolean;
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  padding = 'md',
  borderTop = false,
  justifyContent = 'flex-end',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const footerStyles: ViewStyle = {
    paddingHorizontal: theme.spacing[padding],
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent,
    ...(borderTop && {
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray['200'],
      marginTop: theme.spacing.sm,
    }),
  };

  return (
    <View style={[footerStyles, style]} {...props}>
      {children}
    </View>
  );
};

// Card Action Area Component (for clickable cards)
interface CardActionAreaProps extends ViewProps {
  onPress?: () => void;
  disabled?: boolean;
}

export const CardActionArea: React.FC<CardActionAreaProps> = ({
  onPress,
  disabled = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const actionStyles: ViewStyle = {
    ...(onPress &&
      !disabled && {
        opacity: 1,
      }),
    ...(disabled && {
      opacity: 0.6,
    }),
  };

  if (onPress && !disabled) {
    return (
      <View
        style={[actionStyles, style]}
        onTouchEnd={onPress}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[actionStyles, style]} {...props}>
      {children}
    </View>
  );
};
