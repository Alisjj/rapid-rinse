import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ThemedCard,
  CardContent,
  CardHeader,
} from '@/components/ui/ThemedCard';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useTheme } from '@/theme';
import { Business, OperatingHours } from '@/types';

interface BusinessCardProps {
  business: Business & {
    imageUrl?: string;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    distance?: number;
    isOpen?: boolean;
  };
  onPress?: () => void;
  onCallPress?: () => void;
  onDirectionsPress?: () => void;
  onGalleryPress?: () => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onPress,
  onCallPress,
  onDirectionsPress,
  onGalleryPress,
  showActions = true,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    } else {
      return `${distance.toFixed(1)}km away`;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialCommunityIcons
          key={`star-${i}`}
          name='star'
          size={16}
          color={theme.colors.warning['500']}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MaterialCommunityIcons
          key='star-half'
          name='star-half-full'
          size={16}
          color={theme.colors.warning['500']}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialCommunityIcons
          key={`star-empty-${i}`}
          name='star-outline'
          size={16}
          color={theme.colors.gray['300']}
        />
      );
    }

    return stars;
  };

  const getCurrentOperatingStatus = (): {
    isOpen: boolean;
    nextChange?: string;
  } => {
    if (business.isOpen !== undefined) {
      return { isOpen: business.isOpen };
    }

    // If we have operating hours, calculate current status
    if (business.operatingHours) {
      const now = new Date();
      const currentDay = now
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

      const todayHours = business.operatingHours[currentDay];
      if (todayHours && todayHours.isOpen) {
        const isCurrentlyOpen =
          currentTime >= todayHours.open && currentTime <= todayHours.close;
        return {
          isOpen: isCurrentlyOpen,
          nextChange: isCurrentlyOpen
            ? `Closes at ${todayHours.close}`
            : `Opens at ${todayHours.open}`,
        };
      }
    }

    return { isOpen: true }; // Default to open if no hours specified
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleCall = () => {
    if (business.phone) {
      Linking.openURL(`tel:${business.phone}`);
    }
    onCallPress?.();
  };

  const handleDirections = () => {
    if (business.address) {
      const encodedAddress = encodeURIComponent(business.address);
      const url = Platform.select({
        ios: `maps://app?daddr=${encodedAddress}`,
        android: `google.navigation:q=${encodedAddress}`,
        default: `https://maps.google.com/maps?daddr=${encodedAddress}`,
      });
      Linking.openURL(url);
    }
    onDirectionsPress?.();
  };

  const renderImage = () => {
    const imageHeight =
      variant === 'compact' ? 80 : variant === 'detailed' ? 200 : 120;
    const imageWidth = variant === 'compact' ? 80 : '100%';

    const imageContainerStyle: ViewStyle = {
      height: imageHeight,
      width: imageWidth,
      backgroundColor: theme.colors.gray['100'],
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      position: 'relative',
      ...(variant === 'compact' && { marginRight: theme.spacing.md }),
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

    if (imageError || !business.imageUrl) {
      return (
        <View style={imageContainerStyle}>
          <View style={placeholderStyle}>
            <MaterialCommunityIcons
              name='store'
              size={variant === 'compact' ? 24 : 48}
              color={theme.colors.gray['400']}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={imageContainerStyle}>
        <Image
          source={{ uri: business.imageUrl }}
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
              size={variant === 'compact' ? 'small' : 'large'}
              color={theme.colors.primary['500']}
            />
          </View>
        )}

        {/* Image gallery indicator */}
        {business.images && business.images.length > 1 && (
          <TouchableOpacity
            onPress={onGalleryPress}
            style={{
              position: 'absolute',
              bottom: theme.spacing.sm,
              right: theme.spacing.sm,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            accessibilityRole='button'
            accessibilityLabel={`View ${business.images.length} photos`}
          >
            <MaterialCommunityIcons
              name='image-multiple'
              size={16}
              color='#FFFFFF'
            />
            <ThemedText
              variant='caption'
              style={{
                color: '#FFFFFF',
                marginLeft: theme.spacing.xs,
                fontWeight: '600',
              }}
            >
              {business.images.length}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRating = () => {
    if (!business.rating) return null;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.xs,
        }}
      >
        <View style={{ flexDirection: 'row', marginRight: theme.spacing.sm }}>
          {renderStars(business.rating)}
        </View>
        <ThemedText
          variant='body'
          style={{ fontWeight: '600', marginRight: theme.spacing.xs }}
        >
          {business.rating.toFixed(1)}
        </ThemedText>
        {business.reviewCount && (
          <ThemedText variant='caption' colorVariant='gray' colorShade='600'>
            ({business.reviewCount} reviews)
          </ThemedText>
        )}
      </View>
    );
  };

  const renderOperatingStatus = () => {
    const status = getCurrentOperatingStatus();

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.xs,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: status.isOpen
              ? theme.colors.success['500']
              : theme.colors.error['500'],
            marginRight: theme.spacing.sm,
          }}
        />
        <ThemedText
          variant='caption'
          colorVariant={status.isOpen ? 'success' : 'error'}
          colorShade='600'
          style={{ fontWeight: '600' }}
        >
          {status.isOpen ? 'Open Now' : 'Closed'}
        </ThemedText>
        {status.nextChange && (
          <ThemedText
            variant='caption'
            colorVariant='gray'
            colorShade='600'
            style={{ marginLeft: theme.spacing.sm }}
          >
            • {status.nextChange}
          </ThemedText>
        )}
      </View>
    );
  };

  const renderContent = () => {
    const isCompact = variant === 'compact';

    return (
      <CardContent padding='md'>
        <View style={{ flexDirection: isCompact ? 'row' : 'column' }}>
          {renderImage()}

          <View style={{ flex: 1 }}>
            <ThemedText
              variant={isCompact ? 'h4' : 'h3'}
              numberOfLines={1}
              style={{ marginBottom: theme.spacing.xs }}
            >
              {business.name}
            </ThemedText>

            {renderRating()}
            {renderOperatingStatus()}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              <MaterialCommunityIcons
                name='map-marker'
                size={16}
                color={theme.colors.gray['500']}
              />
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
                numberOfLines={1}
                style={{
                  flex: 1,
                  marginLeft: theme.spacing.xs,
                  marginRight: theme.spacing.sm,
                }}
              >
                {business.address}
              </ThemedText>
              {business.distance && (
                <ThemedText
                  variant='caption'
                  colorVariant='primary'
                  colorShade='600'
                  style={{ fontWeight: '600' }}
                >
                  {formatDistance(business.distance)}
                </ThemedText>
              )}
            </View>

            {variant === 'detailed' && business.description && (
              <ThemedText
                variant='body'
                colorVariant='gray'
                colorShade='600'
                numberOfLines={3}
                style={{ marginBottom: theme.spacing.sm }}
              >
                {business.description}
              </ThemedText>
            )}

            {showActions && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: theme.spacing.sm,
                }}
              >
                <ThemedButton
                  title='View Details'
                  variant='primary'
                  size={isCompact ? 'sm' : 'md'}
                  onPress={onPress}
                  style={{ flex: 1, marginRight: theme.spacing.sm }}
                  accessibilityLabel={`View details for ${business.name}`}
                />

                <View style={{ flexDirection: 'row' }}>
                  {business.phone && (
                    <TouchableOpacity
                      onPress={handleCall}
                      style={{
                        padding: theme.spacing.sm,
                        marginRight: theme.spacing.xs,
                      }}
                      accessibilityRole='button'
                      accessibilityLabel={`Call ${business.name}`}
                    >
                      <MaterialCommunityIcons
                        name='phone'
                        size={24}
                        color={theme.colors.success['500']}
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={handleDirections}
                    style={{
                      padding: theme.spacing.sm,
                    }}
                    accessibilityRole='button'
                    accessibilityLabel={`Get directions to ${business.name}`}
                  >
                    <MaterialCommunityIcons
                      name='directions'
                      size={24}
                      color={theme.colors.primary['500']}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </CardContent>
    );
  };

  const cardStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
    ...(Platform.OS === 'web' && {
      cursor: (onPress ? 'pointer' : 'default') as any,
    }),
  };

  if (onPress && !showActions) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole='button'
        accessibilityLabel={`View details for ${business.name}`}
        accessibilityHint='Double tap to view business details'
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
