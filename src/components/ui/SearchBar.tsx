import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
  Dimensions,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  debounceMs?: number;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  searchIcon?: React.ReactNode;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: 'default' | 'rounded' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  borderColor?: string;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value = '',
  onChangeText,
  onSearch,
  onClear,
  onFocus,
  onBlur,
  debounceMs = 300,
  loading = false,
  disabled = false,
  autoFocus = false,
  leftIcon,
  rightIcon,
  clearIcon,
  searchIcon,
  showClearButton = true,
  showSearchButton = false,
  containerStyle,
  inputStyle,
  variant = 'default',
  size = 'md',
  backgroundColor,
  borderColor,
  suggestions = [],
  onSuggestionPress,
  showSuggestions = false,
  maxSuggestions = 5,
}) => {
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);
  const screenWidth = Dimensions.get('window').width;

  // Handle debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onSearch && searchText !== value) {
        onSearch(searchText);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText, debounceMs, onSearch, value]);

  // Update local state when value prop changes
  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    setSearchText('');
    onChangeText?.('');
    onClear?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && suggestions.length > 0) {
      setShowSuggestionsList(true);
    }
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion tap
    setTimeout(() => {
      setShowSuggestionsList(false);
    }, 150);
    onBlur?.();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
    onChangeText?.(suggestion);
    onSuggestionPress?.(suggestion);
    setShowSuggestionsList(false);
    inputRef.current?.blur();
  };

  const handleSearchPress = () => {
    onSearch?.(searchText);
    inputRef.current?.blur();
  };

  // Get size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          height: 36,
          fontSize: 14,
          iconSize: 18,
          padding: theme.spacing.sm,
        };
      case 'lg':
        return {
          height: 52,
          fontSize: 18,
          iconSize: 24,
          padding: theme.spacing.lg,
        };
      case 'md':
      default:
        return {
          height: 44,
          fontSize: 16,
          iconSize: 20,
          padding: theme.spacing.md,
        };
    }
  };

  const dimensions = getSizeDimensions();

  // Default icons
  const defaultSearchIcon = (
    <MaterialCommunityIcons
      name='magnify'
      size={dimensions.iconSize}
      color={theme.colors.gray['500']}
    />
  );

  const defaultClearIcon = (
    <MaterialCommunityIcons
      name='close-circle'
      size={dimensions.iconSize}
      color={theme.colors.gray['500']}
    />
  );

  // Filter suggestions based on search text
  const filteredSuggestions = suggestions
    .filter(suggestion =>
      suggestion.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(0, maxSuggestions);

  // Container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: backgroundColor || theme.colors.surface,
      paddingHorizontal: dimensions.padding,
      minHeight: dimensions.height,
    };

    switch (variant) {
      case 'rounded':
        return {
          ...baseStyles,
          borderRadius: theme.borderRadius.full,
          borderWidth: 1,
          borderColor:
            borderColor ||
            (isFocused
              ? theme.colors.primary['500']
              : theme.colors.gray['300']),
          ...theme.shadows.sm,
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor:
            borderColor ||
            (isFocused
              ? theme.colors.primary['500']
              : theme.colors.gray['300']),
          borderRadius: 0,
          paddingHorizontal: 0,
        };
      case 'default':
      default:
        return {
          ...baseStyles,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor:
            borderColor ||
            (isFocused
              ? theme.colors.primary['500']
              : theme.colors.gray['300']),
          ...theme.shadows.sm,
        };
    }
  };

  // Input styles
  const getInputStyles = (): TextStyle => {
    return {
      flex: 1,
      fontSize: dimensions.fontSize,
      color: theme.colors.text,
      paddingVertical: 0, // Remove default padding
      marginHorizontal: variant === 'minimal' ? 0 : theme.spacing.sm,
      ...(Platform.OS === 'web' && {
        // @ts-ignore - web-only property
        outline: 'none',
      }),
    };
  };

  // Icon container styles
  const getIconContainerStyles = (): ViewStyle => {
    return {
      padding: theme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  // Suggestions list styles
  const getSuggestionsStyles = (): ViewStyle => {
    return {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.gray['200'],
      maxHeight: 200,
      zIndex: 1000,
      ...theme.shadows.lg,
    };
  };

  return (
    <View style={{ position: 'relative' }}>
      <View style={[getContainerStyles(), containerStyle]}>
        {/* Left Icon */}
        <View style={getIconContainerStyles()}>
          {leftIcon || searchIcon || defaultSearchIcon}
        </View>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={[getInputStyles(), inputStyle]}
          value={searchText}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray['400']}
          autoFocus={autoFocus}
          editable={!disabled}
          returnKeyType='search'
          onSubmitEditing={() => onSearch?.(searchText)}
          accessibilityLabel={placeholder}
          accessibilityHint='Enter text to search'
        />

        {/* Loading Indicator */}
        {loading && (
          <View style={getIconContainerStyles()}>
            <ActivityIndicator
              size='small'
              color={theme.colors.primary['500']}
            />
          </View>
        )}

        {/* Clear Button */}
        {showClearButton && searchText.length > 0 && !loading && (
          <TouchableOpacity
            onPress={handleClear}
            style={getIconContainerStyles()}
            accessibilityRole='button'
            accessibilityLabel='Clear search'
          >
            {clearIcon || defaultClearIcon}
          </TouchableOpacity>
        )}

        {/* Search Button */}
        {showSearchButton && !loading && (
          <TouchableOpacity
            onPress={handleSearchPress}
            style={getIconContainerStyles()}
            accessibilityRole='button'
            accessibilityLabel='Search'
          >
            <MaterialCommunityIcons
              name='magnify'
              size={dimensions.iconSize}
              color={theme.colors.primary['500']}
            />
          </TouchableOpacity>
        )}

        {/* Right Icon */}
        {rightIcon && !loading && !showSearchButton && (
          <View style={getIconContainerStyles()}>{rightIcon}</View>
        )}
      </View>

      {/* Suggestions List */}
      {showSuggestions &&
        showSuggestionsList &&
        filteredSuggestions.length > 0 && (
          <View style={getSuggestionsStyles()}>
            {filteredSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSuggestionPress(suggestion)}
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderBottomWidth:
                    index < filteredSuggestions.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.gray['200'],
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                accessibilityRole='button'
                accessibilityLabel={`Select suggestion: ${suggestion}`}
              >
                <MaterialCommunityIcons
                  name='history'
                  size={16}
                  color={theme.colors.gray['400']}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: dimensions.fontSize,
                      color: theme.colors.text,
                    }}
                    numberOfLines={1}
                  >
                    {suggestion}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name='arrow-top-left'
                  size={16}
                  color={theme.colors.gray['400']}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
    </View>
  );
};
