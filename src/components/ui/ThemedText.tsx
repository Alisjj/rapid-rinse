import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme';
import { TextVariant, ColorVariant } from '@/types';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  colorVariant?: ColorVariant;
  colorShade?:
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color,
  colorVariant,
  colorShade = '500',
  align = 'left',
  weight,
  italic = false,
  underline = false,
  strikethrough = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // Get base typography style
  const getTypographyStyle = (): TextStyle => {
    return theme.typography[variant];
  };

  // Get text color
  const getTextColor = (): string => {
    if (color) return color;

    if (colorVariant) {
      return theme.colors[colorVariant][colorShade];
    }

    return theme.colors.text;
  };

  // Build text style
  const textStyle: TextStyle = {
    ...getTypographyStyle(),
    color: getTextColor(),
    textAlign: align,
    ...(weight && { fontWeight: weight }),
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecorationLine: 'underline' }),
    ...(strikethrough && { textDecorationLine: 'line-through' }),
    ...(underline &&
      strikethrough && { textDecorationLine: 'underline line-through' }),
  };

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};
