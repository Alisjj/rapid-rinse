import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import { ButtonVariant, ButtonSize } from '@/types';

interface ThemedButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  title,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  accessibilityLabel,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // Button variant styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary['500'],
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary['500'],
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary['500'],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.primary['500'],
          borderWidth: 0,
        };
    }
  };

  // Button size styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          minHeight: 32,
        };
      case 'md':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 40,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        };
      default:
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 40,
        };
    }
  };

  // Text color based on variant
  const getTextColor = (): string => {
    if (disabled) {
      return theme.colors.gray['500'];
    }

    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return theme.colors.primary['500'];
      case 'ghost':
        return theme.colors.primary['500'];
      default:
        return '#FFFFFF';
    }
  };

  // Text size based on button size
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return {
          fontSize: 14,
          fontWeight: '600',
          lineHeight: 20,
        };
      case 'md':
        return theme.typography.button;
      case 'lg':
        return {
          fontSize: 18,
          fontWeight: '600',
          lineHeight: 28,
        };
      default:
        return theme.typography.button;
    }
  };

  // Disabled styles
  const getDisabledStyles = (): ViewStyle => {
    if (!disabled && !loading) return {};

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          backgroundColor: theme.colors.gray['300'],
          opacity: 0.6,
        };
      case 'outline':
        return {
          borderColor: theme.colors.gray['300'],
          opacity: 0.6,
        };
      case 'ghost':
        return {
          opacity: 0.6,
        };
      default:
        return {
          backgroundColor: theme.colors.gray['300'],
          opacity: 0.6,
        };
    }
  };

  // Loading spinner color
  const getSpinnerColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return theme.colors.primary['500'];
      default:
        return '#FFFFFF';
    }
  };

  // Icon spacing
  const getIconSpacing = (): number => {
    switch (size) {
      case 'sm':
        return theme.spacing.xs;
      case 'md':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.sm;
      default:
        return theme.spacing.sm;
    }
  };

  const baseStyles: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // Only apply shadow to solid button variants (primary, secondary)
    ...(variant === 'primary' || variant === 'secondary'
      ? theme.shadows.sm
      : {}),
  };

  const buttonStyles: ViewStyle = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getDisabledStyles(),
    ...(fullWidth && { width: '100%' }),
  };

  const textStyles: TextStyle = {
    ...getTextSize(),
    color: getTextColor(),
  };

  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator
            size='small'
            color={getSpinnerColor()}
            style={{ marginRight: title ? getIconSpacing() : 0 }}
          />
          {title ? <Text style={textStyles}>{title}</Text> : null}
        </View>
      );
    }

    if (icon && title) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {iconPosition === 'left' && (
            <View style={{ marginRight: getIconSpacing() }}>{icon}</View>
          )}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && (
            <View style={{ marginLeft: getIconSpacing() }}>{icon}</View>
          )}
        </View>
      );
    }

    if (icon && !title) {
      return icon;
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      disabled={isDisabled}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
