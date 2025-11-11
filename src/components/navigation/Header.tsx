import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ViewStyle,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/theme';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  logoSource?: any;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showNotificationBadge?: boolean;
  notificationCount?: number;
  backgroundColor?: string;
  variant?: 'default' | 'transparent' | 'minimal';
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = false,
  logoSource,
  leftIcon = 'menu',
  rightIcon = 'bell',
  onLeftPress,
  onRightPress,
  showNotificationBadge = false,
  notificationCount = 0,
  backgroundColor,
  variant = 'default',
  showBackButton = false,
  onBackPress,
  rightComponent,
  leftComponent,
}) => {
  const { theme } = useTheme();

  const getHeaderStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
    };

    switch (variant) {
      case 'transparent':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || theme.colors.background,
          borderBottomWidth: 0,
        };
      case 'default':
      default:
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.gray['200'],
          ...theme.shadows.sm,
        };
    }
  };

  const renderLeftComponent = () => {
    if (leftComponent) {
      return <View style={{ flex: 1 }}>{leftComponent}</View>;
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          onPress={onBackPress}
          style={{
            padding: theme.spacing.sm,
            marginLeft: -theme.spacing.sm,
          }}
          accessibilityRole='button'
          accessibilityLabel='Go back'
          accessibilityHint='Navigate to previous screen'
        >
          <MaterialCommunityIcons
            name='arrow-left'
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      );
    }

    if (onLeftPress) {
      return (
        <TouchableOpacity
          onPress={onLeftPress}
          style={{
            padding: theme.spacing.sm,
            marginLeft: -theme.spacing.sm,
          }}
          accessibilityRole='button'
          accessibilityLabel={leftIcon === 'menu' ? 'Open menu' : 'Action'}
        >
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={24}
            color={theme.colors.primary['500']}
          />
        </TouchableOpacity>
      );
    }

    return <View style={{ width: 40 }} />;
  };

  const renderCenterComponent = () => {
    if (showLogo && logoSource) {
      return (
        <Image
          source={logoSource}
          style={{
            height: 32,
            width: 120,
            resizeMode: 'contain',
          }}
          accessibilityLabel='App logo'
        />
      );
    }

    if (title) {
      return (
        <ThemedText
          variant='h3'
          numberOfLines={1}
          style={{
            textAlign: 'center',
            flex: 1,
            marginHorizontal: theme.spacing.md,
          }}
        >
          {title}
        </ThemedText>
      );
    }

    return <View style={{ flex: 1 }} />;
  };

  const renderRightComponent = () => {
    if (rightComponent) {
      return <View style={{ alignItems: 'flex-end' }}>{rightComponent}</View>;
    }

    if (onRightPress) {
      return (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            padding: theme.spacing.sm,
            marginRight: -theme.spacing.sm,
            position: 'relative',
          }}
          accessibilityRole='button'
          accessibilityLabel={
            rightIcon === 'bell' ? 'View notifications' : 'Action'
          }
          accessibilityHint={
            showNotificationBadge && notificationCount > 0
              ? `You have ${notificationCount} notifications`
              : undefined
          }
        >
          <MaterialCommunityIcons
            name={rightIcon as any}
            size={24}
            color={theme.colors.primary['500']}
          />

          {/* Notification badge */}
          {showNotificationBadge && notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: theme.spacing.xs,
                right: theme.spacing.xs,
                backgroundColor: theme.colors.error['500'],
                borderRadius: theme.borderRadius.full,
                minWidth: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.xs,
              }}
            >
              <ThemedText
                variant='caption'
                style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: '600',
                  lineHeight: 12,
                }}
              >
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return <View style={{ width: 40 }} />;
  };

  const headerStyles = getHeaderStyles();

  // For transparent variant, we need to account for status bar
  if (variant === 'transparent') {
    return (
      <View style={headerStyles}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        <SafeAreaView style={{ width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
            }}
          >
            {renderLeftComponent()}
            {renderCenterComponent()}
            {renderRightComponent()}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={headerStyles}>
      {renderLeftComponent()}
      {renderCenterComponent()}
      {renderRightComponent()}
    </View>
  );
};
