import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { ThemedText } from './ThemedText';

interface HelperTextProps {
  text?: string;
  type?: 'default' | 'error' | 'warning' | 'success';
  icon?: React.ReactNode;
  visible?: boolean;
  style?: ViewStyle;
}

export const HelperText: React.FC<HelperTextProps> = ({
  text,
  type = 'default',
  icon,
  visible = true,
  style,
}) => {
  const { theme } = useTheme();

  if (!visible || !text) {
    return null;
  }

  // Get color based on type
  const getColor = (): string => {
    switch (type) {
      case 'error':
        return theme.colors.error['500'];
      case 'warning':
        return theme.colors.warning['500'];
      case 'success':
        return theme.colors.success['500'];
      case 'default':
      default:
        return theme.colors.textSecondary;
    }
  };

  // Get icon color (slightly darker than text)
  const getIconColor = (): string => {
    switch (type) {
      case 'error':
        return theme.colors.error['600'];
      case 'warning':
        return theme.colors.warning['600'];
      case 'success':
        return theme.colors.success['600'];
      case 'default':
      default:
        return theme.colors.gray['500'];
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  };

  return (
    <View style={[containerStyle, style]}>
      {icon && (
        <View style={{ marginRight: theme.spacing.xs, marginTop: 2 }}>
          {icon}
        </View>
      )}
      <ThemedText
        variant="caption"
        color={getColor()}
        style={{ flex: 1, lineHeight: 16 }}
      >
        {text}
      </ThemedText>
    </View>
  );
};

// Error Message Component
interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  visible = true,
  icon,
  style,
}) => {
  return (
    <HelperText
      text={message}
      type="error"
      icon={icon}
      visible={visible}
      style={style}
    />
  );
};

// Success Message Component
interface SuccessMessageProps {
  message?: string;
  visible?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  visible = true,
  icon,
  style,
}) => {
  return (
    <HelperText
      text={message}
      type="success"
      icon={icon}
      visible={visible}
      style={style}
    />
  );
};

// Warning Message Component
interface WarningMessageProps {
  message?: string;
  visible?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const WarningMessage: React.FC<WarningMessageProps> = ({
  message,
  visible = true,
  icon,
  style,
}) => {
  return (
    <HelperText
      text={message}
      type="warning"
      icon={icon}
      visible={visible}
      style={style}
    />
  );
};
