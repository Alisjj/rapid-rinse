import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedCard, CardContent } from '@/components/ui/ThemedCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/theme';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service & {
    imageUrl?: string;
    isAvailable?: boolean;
    businessId?: string;
  };
  onPress?: () => void;
  onBookPress?: () => void;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  onBookPress,
  onFavoritePress,
  onSharePress,
  isFavorite = false,
  showActions = true,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const renderImage = () => {
    const imageHeight = variant === 'compact' ? 120 : 180;

    const imageContainerStyle: ViewStyle = {
      height: imageHeight,
      backgroundColor: theme.colors.gray['100'],
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
      position: 'relative',
    };

    const imageStyle: ImageStyle = {
      width: '100%',
      height: '100%',
    };

    const placeholderStyle: ViewStyle = {
      ...imageStyle,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.gray['200'],
    };

    if (imageError || !service.imageUrl) {
      return (
        <View style={imageContainerStyle}>
          <View style={placeholderStyle}>
            <MaterialCommunityIcons
              name='car-wash'
              size={48}
              color={theme.colors.gray['400']}
            />
            <ThemedText
              variant='caption'
              colorVariant='gray'
              colorShade='500'
              style={{ marginTop: theme.spacing.xs }}
            >
              No Image
            </ThemedText>
          </View>
        </View>
      );
    }

    return (
      <View style={imageContainerStyle}>
        <Image
          source={{ uri: service.imageUrl }}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
          resizeMode='cover'
        />
        {imageLoading && (
          <View
            style={[
              placeholderStyle,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}
          >
            <ActivityIndicator
              size='large'
              color={theme.colors.primary['500']}
            />
          </View>
        )}

        {/* Availability indicator */}
        <View
          style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
            backgroundColor:
              service.isAvailable !== false
                ? theme.colors.success['500']
                : theme.colors.error['500'],
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.full,
          }}
        >
          <ThemedText
            variant='caption'
            style={{
              color: '#FFFFFF',
              fontWeight: '600',
            }}
          >
            {service.isAvailable !== false ? 'Available' : 'Unavailable'}
          </ThemedText>
        </View>
      </View>
    );
  };

  const renderContent = () => (
    <CardContent padding='md'>
      {renderImage()}

      <View style={{ marginBottom: theme.spacing.sm }}>
        <ThemedText
          variant={variant === 'compact' ? 'h4' : 'h3'}
          style={{ marginBottom: theme.spacing.xs }}
          numberOfLines={1}
        >
          {service.name}
        </ThemedText>

        <ThemedText
          variant='body'
          colorVariant='gray'
          colorShade='600'
          numberOfLines={variant === 'compact' ? 2 : 3}
          style={{ marginBottom: theme.spacing.sm }}
        >
          {service.description}
        </ThemedText>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.sm,
          }}
        >
          <ThemedText
            variant='h4'
            colorVariant='primary'
            style={{ fontWeight: '700' }}
          >
            {formatPrice(service.price)}
          </ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name='clock-outline'
              size={16}
              color={theme.colors.gray['500']}
            />
            <ThemedText
              variant='caption'
              colorVariant='gray'
              colorShade='600'
              style={{ marginLeft: theme.spacing.xs }}
            >
              {formatDuration(service.duration)}
            </ThemedText>
          </View>
        </View>

        {service.category && (
          <View
            style={{
              backgroundColor: theme.colors.primary['50'],
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.md,
              alignSelf: 'flex-start',
              marginBottom: theme.spacing.sm,
            }}
          >
            <ThemedText
              variant='caption'
              colorVariant='primary'
              colorShade='700'
              style={{ fontWeight: '600' }}
            >
              {service.category}
            </ThemedText>
          </View>
        )}
      </View>

      {showActions && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ThemedButton
            title='Book Now'
            variant='primary'
            size={variant === 'compact' ? 'sm' : 'md'}
            onPress={onBookPress}
            disabled={service.isAvailable === false}
            style={{ flex: 1, marginRight: theme.spacing.sm }}
            accessibilityLabel={`Book ${service.name} service`}
          />

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={onFavoritePress}
              style={{
                padding: theme.spacing.sm,
                marginRight: theme.spacing.xs,
              }}
              accessibilityRole='button'
              accessibilityLabel={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={
                  isFavorite
                    ? theme.colors.error['500']
                    : theme.colors.gray['500']
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSharePress}
              style={{
                padding: theme.spacing.sm,
              }}
              accessibilityRole='button'
              accessibilityLabel={`Share ${service.name} service`}
            >
              <MaterialCommunityIcons
                name='share-variant'
                size={24}
                color={theme.colors.gray['500']}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </CardContent>
  );

  const cardStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
    ...(Platform.OS === 'web' && {
      cursor: (onPress ? 'pointer' : 'default') as any,
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole='button'
        accessibilityLabel={`View details for ${service.name}`}
        accessibilityHint='Double tap to view service details'
      >
        <ThemedCard variant='elevated' style={cardStyle} hoverable={true}>
          {renderContent()}
        </ThemedCard>
      </TouchableOpacity>
    );
  }

  return (
    <ThemedCard variant='elevated' style={cardStyle}>
      {renderContent()}
    </ThemedCard>
  );
};
