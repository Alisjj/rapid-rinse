import React, { useState, useRef } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  ViewStyle,
  TextStyle,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/theme';
import { SpacingSize } from '@/types';

interface ThemedTextInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  floatingLabel?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  label,
  helperText,
  errorText,
  variant = 'outlined',
  size = 'md',
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  floatingLabel = false,
  containerStyle,
  inputStyle,
  labelStyle,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (floatingLabel) {
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (floatingLabel && !hasValue) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setHasValue(!!text);
    props.onChangeText?.(text);
  };

  // Get container styles based on variant
  const getContainerStyles = (): ViewStyle => {
    const minHeight = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
    const baseStyles: ViewStyle = {
      marginBottom: theme.spacing.sm,
      minHeight,
      maxHeight: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: errorText
            ? theme.colors.error['500']
            : isFocused
              ? theme.colors.primary['500']
              : theme.colors.gray['300'],
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.surface,
        };
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.gray['100'],
          borderRadius: theme.borderRadius.md,
          borderBottomWidth: 2,
          borderBottomColor: errorText
            ? theme.colors.error['500']
            : isFocused
              ? theme.colors.primary['500']
              : theme.colors.gray['300'],
        };
      case 'standard':
        return {
          ...baseStyles,
          borderBottomWidth: 1,
          borderBottomColor: errorText
            ? theme.colors.error['500']
            : isFocused
              ? theme.colors.primary['500']
              : theme.colors.gray['300'],
        };
      default:
        return baseStyles;
    }
  };

  // Get input styles based on size
  const getInputStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      color: theme.colors.text,
      fontSize: 16,
      minHeight: 40,
    };

    switch (size) {
      case 'sm':
        return {
          ...baseStyles,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: 14,
          minHeight: 32,
        };
      case 'md':
        return {
          ...baseStyles,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: 16,
          minHeight: 40,
        };
      case 'lg':
        return {
          ...baseStyles,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          fontSize: 18,
          minHeight: 48,
        };
      default:
        return baseStyles;
    }
  };

  // Get label styles
  const getLabelStyles = (): TextStyle => {
    return {
      ...theme.typography.caption,
      color: errorText
        ? theme.colors.error['500']
        : isFocused
          ? theme.colors.primary['500']
          : theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    };
  };

  // Get floating label styles
  const getFloatingLabelStyles = () => {
    return {
      position: 'absolute' as const,
      left: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.xs,
      color: errorText
        ? theme.colors.error['500']
        : isFocused
          ? theme.colors.primary['500']
          : theme.colors.textSecondary,
      fontSize: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      top: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [12, -8],
      }),
    };
  };

  // Get helper/error text styles
  const getHelperTextStyles = (): TextStyle => {
    return {
      ...theme.typography.caption,
      color: errorText ? theme.colors.error['500'] : theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      marginLeft: variant === 'outlined' ? theme.spacing.md : 0,
    };
  };

  const containerStyles = getContainerStyles();
  const inputStyles = getInputStyles();

  return (
    <View style={[containerStyle]}>
      {/* Static Label */}
      {label && !floatingLabel && (
        <Text style={[getLabelStyles(), labelStyle]}>
          {label}
          {required && (
            <Text style={{ color: theme.colors.error['500'] }}> *</Text>
          )}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={[
          containerStyles,
          { flexDirection: 'row', alignItems: 'center' },
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View
            style={{
              marginLeft: theme.spacing.sm,
              marginRight: 0,
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 24,
              height: '100%',
            }}
          >
            {leftIcon}
          </View>
        )}

        {/* Floating Label */}
        {label && floatingLabel && (
          <Animated.Text style={getFloatingLabelStyles()}>
            {label}
            {required && (
              <Text style={{ color: theme.colors.error['500'] }}> *</Text>
            )}
          </Animated.Text>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            inputStyles,
            { flex: 1 },
            inputStyle,
            disabled && { opacity: 0.6 },
            leftIcon ? { paddingLeft: theme.spacing.sm } : undefined,
            rightIcon ? { paddingRight: theme.spacing.sm } : undefined,
          ].filter(Boolean)}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          placeholderTextColor={theme.colors.gray['400']}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{
              marginRight: theme.spacing.sm,
              marginLeft: 0,
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 24,
              height: '100%',
              paddingHorizontal: theme.spacing.xs,
            }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <Text style={getHelperTextStyles()}>{errorText || helperText}</Text>
      )}
    </View>
  );
};
