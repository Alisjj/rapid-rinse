import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  Platform,
  Alert,
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
import { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking & {
    serviceName?: string;
    businessName?: string;
    serviceDetails?: {
      name: string;
      duration: number;
      price: number;
    }[];
    paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
    canReschedule?: boolean;
    canCancel?: boolean;
  };
  onPress?: () => void;
  onReschedulePress?: () => void;
  onCancelPress?: () => void;
  onContactPress?: () => void;
  onPaymentPress?: () => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onReschedulePress,
  onCancelPress,
  onContactPress,
  onPaymentPress,
  showActions = true,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return theme.colors.success['500'];
      case 'pending':
        return theme.colors.warning['500'];
      case 'completed':
        return theme.colors.primary['500'];
      case 'cancelled':
        return theme.colors.error['500'];
      default:
        return theme.colors.gray['500'];
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return theme.colors.success['500'];
      case 'pending':
        return theme.colors.warning['500'];
      case 'failed':
        return theme.colors.error['500'];
      case 'refunded':
        return theme.colors.gray['500'];
      default:
        return theme.colors.gray['400'];
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  const getTimelineSteps = () => {
    const steps = [
      { key: 'pending', label: 'Booking Placed', completed: true },
      {
        key: 'confirmed',
        label: 'Confirmed',
        completed: booking.status !== 'pending',
      },
      {
        key: 'completed',
        label: 'Service Complete',
        completed: booking.status === 'completed',
      },
    ];

    if (booking.status === 'cancelled') {
      return [
        { key: 'pending', label: 'Booking Placed', completed: true },
        {
          key: 'cancelled',
          label: 'Cancelled',
          completed: true,
          isError: true,
        },
      ];
    }

    return steps;
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: onCancelPress,
        },
      ]
    );
  };

  const renderTimeline = () => {
    const steps = getTimelineSteps();

    return (
      <View style={{ marginVertical: theme.spacing.md }}>
        <ThemedText variant='h4' style={{ marginBottom: theme.spacing.sm }}>
          Booking Progress
        </ThemedText>

        <View style={{ paddingLeft: theme.spacing.md }}>
          {steps.map((step, index) => (
            <View
              key={step.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: index < steps.length - 1 ? theme.spacing.md : 0,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: step.completed
                    ? step.isError
                      ? theme.colors.error['500']
                      : theme.colors.success['500']
                    : theme.colors.gray['300'],
                  marginRight: theme.spacing.md,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {step.completed && (
                  <MaterialCommunityIcons
                    name={step.isError ? 'close' : 'check'}
                    size={12}
                    color='#FFFFFF'
                  />
                )}
              </View>

              <ThemedText
                variant='body'
                colorVariant={
                  step.completed ? (step.isError ? 'error' : 'success') : 'gray'
                }
                colorShade={step.completed ? '600' : '400'}
                style={{ fontWeight: step.completed ? '600' : '400' }}
              >
                {step.label}
              </ThemedText>

              {index < steps.length - 1 && !step.isError && (
                <View
                  style={{
                    position: 'absolute',
                    left: 9,
                    top: 20,
                    width: 2,
                    height: theme.spacing.md,
                    backgroundColor: steps[index + 1].completed
                      ? theme.colors.success['500']
                      : theme.colors.gray['300'],
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderServiceDetails = () => {
    if (!booking.serviceDetails || !expanded) return null;

    return (
      <View style={{ marginTop: theme.spacing.md }}>
        <ThemedText variant='h4' style={{ marginBottom: theme.spacing.sm }}>
          Service Details
        </ThemedText>

        {booking.serviceDetails.map((service, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: theme.spacing.sm,
              borderBottomWidth:
                index < booking.serviceDetails!.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.gray['200'],
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText variant='body' style={{ fontWeight: '600' }}>
                {service.name}
              </ThemedText>
              <ThemedText
                variant='caption'
                colorVariant='gray'
                colorShade='600'
              >
                {service.duration} minutes
              </ThemedText>
            </View>
            <ThemedText variant='body' style={{ fontWeight: '600' }}>
              {formatPrice(service.price)}
            </ThemedText>
          </View>
        ))}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: theme.spacing.md,
            borderTopWidth: 2,
            borderTopColor: theme.colors.gray['300'],
            marginTop: theme.spacing.sm,
          }}
        >
          <ThemedText variant='h4'>Total</ThemedText>
          <ThemedText
            variant='h4'
            colorVariant='primary'
            style={{ fontWeight: '700' }}
          >
            {formatPrice(booking.totalAmount)}
          </ThemedText>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    const isCompact = variant === 'compact';

    return (
      <CardContent padding='md'>
        {/* Header with status */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.sm,
          }}
        >
          <ThemedText
            variant={isCompact ? 'h4' : 'h3'}
            numberOfLines={1}
            style={{ flex: 1, marginRight: theme.spacing.sm }}
          >
            {booking.serviceName || 'Car Wash Service'}
          </ThemedText>

          <View
            style={{
              backgroundColor: getStatusColor(booking.status),
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
                textTransform: 'capitalize',
              }}
            >
              {booking.status}
            </ThemedText>
          </View>
        </View>

        {/* Business name */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.sm,
          }}
        >
          <MaterialCommunityIcons
            name='store'
            size={16}
            color={theme.colors.gray['500']}
          />
          <ThemedText
            variant='body'
            colorVariant='gray'
            colorShade='600'
            style={{ marginLeft: theme.spacing.xs }}
          >
            {booking.businessName || 'Business Name'}
          </ThemedText>
        </View>

        {/* Date and time */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.sm,
          }}
        >
          <MaterialCommunityIcons
            name='calendar'
            size={16}
            color={theme.colors.primary['500']}
          />
          <ThemedText
            variant='body'
            style={{ marginLeft: theme.spacing.xs, fontWeight: '600' }}
          >
            {formatDate(booking.scheduledDate)}
          </ThemedText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          <MaterialCommunityIcons
            name='clock'
            size={16}
            color={theme.colors.primary['500']}
          />
          <ThemedText
            variant='body'
            style={{ marginLeft: theme.spacing.xs, fontWeight: '600' }}
          >
            {formatTime(booking.scheduledDate)}
          </ThemedText>
        </View>

        {/* Payment status */}
        {booking.paymentStatus && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name='credit-card'
                size={16}
                color={getPaymentStatusColor(booking.paymentStatus)}
              />
              <ThemedText
                variant='body'
                style={{ marginLeft: theme.spacing.xs }}
              >
                Payment:
              </ThemedText>
              <ThemedText
                variant='body'
                style={{
                  marginLeft: theme.spacing.xs,
                  fontWeight: '600',
                  color: getPaymentStatusColor(booking.paymentStatus),
                  textTransform: 'capitalize',
                }}
              >
                {booking.paymentStatus}
              </ThemedText>
            </View>

            <ThemedText
              variant='h4'
              colorVariant='primary'
              style={{ fontWeight: '700' }}
            >
              {formatPrice(booking.totalAmount)}
            </ThemedText>
          </View>
        )}

        {/* Timeline for detailed view */}
        {variant === 'detailed' && renderTimeline()}

        {/* Service details expansion */}
        {booking.serviceDetails && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: theme.spacing.sm,
              marginBottom: theme.spacing.sm,
            }}
            accessibilityRole='button'
            accessibilityLabel={
              expanded ? 'Hide service details' : 'Show service details'
            }
          >
            <ThemedText
              variant='body'
              colorVariant='primary'
              style={{ fontWeight: '600' }}
            >
              {expanded ? 'Hide Details' : 'Show Details'}
            </ThemedText>
            <MaterialCommunityIcons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.primary['500']}
              style={{ marginLeft: theme.spacing.xs }}
            />
          </TouchableOpacity>
        )}

        {renderServiceDetails()}

        {/* Notes */}
        {booking.notes && (
          <View
            style={{
              backgroundColor: theme.colors.gray['50'],
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginTop: theme.spacing.md,
            }}
          >
            <ThemedText
              variant='caption'
              colorVariant='gray'
              colorShade='600'
              style={{ fontWeight: '600', marginBottom: theme.spacing.xs }}
            >
              Notes:
            </ThemedText>
            <ThemedText variant='body' colorVariant='gray' colorShade='700'>
              {booking.notes}
            </ThemedText>
          </View>
        )}

        {/* Actions */}
        {showActions && (
          <View style={{ marginTop: theme.spacing.md }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.sm,
              }}
            >
              {booking.canReschedule !== false &&
                booking.status !== 'completed' &&
                booking.status !== 'cancelled' && (
                  <ThemedButton
                    title='Reschedule'
                    variant='outline'
                    size={isCompact ? 'sm' : 'md'}
                    onPress={onReschedulePress}
                    style={{ flex: 1, marginRight: theme.spacing.sm }}
                    icon={
                      <MaterialCommunityIcons
                        name='calendar-edit'
                        size={16}
                        color={theme.colors.primary['500']}
                      />
                    }
                    accessibilityLabel='Reschedule booking'
                  />
                )}

              {booking.paymentStatus === 'pending' && onPaymentPress && (
                <ThemedButton
                  title='Pay Now'
                  variant='primary'
                  size={isCompact ? 'sm' : 'md'}
                  onPress={onPaymentPress}
                  style={{ flex: 1, marginRight: theme.spacing.sm }}
                  icon={
                    <MaterialCommunityIcons
                      name='credit-card'
                      size={16}
                      color='#FFFFFF'
                    />
                  }
                  accessibilityLabel='Complete payment'
                />
              )}
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TouchableOpacity
                onPress={onContactPress}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: theme.spacing.sm,
                  marginRight: theme.spacing.sm,
                }}
                accessibilityRole='button'
                accessibilityLabel='Contact business'
              >
                <MaterialCommunityIcons
                  name='phone'
                  size={20}
                  color={theme.colors.success['500']}
                />
                <ThemedText
                  variant='body'
                  colorVariant='success'
                  style={{ marginLeft: theme.spacing.xs, fontWeight: '600' }}
                >
                  Contact
                </ThemedText>
              </TouchableOpacity>

              {booking.canCancel !== false &&
                booking.status !== 'completed' &&
                booking.status !== 'cancelled' && (
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: theme.spacing.sm,
                    }}
                    accessibilityRole='button'
                    accessibilityLabel='Cancel booking'
                  >
                    <MaterialCommunityIcons
                      name='cancel'
                      size={20}
                      color={theme.colors.error['500']}
                    />
                    <ThemedText
                      variant='body'
                      colorVariant='error'
                      style={{
                        marginLeft: theme.spacing.xs,
                        fontWeight: '600',
                      }}
                    >
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
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
        accessibilityLabel={`View booking details for ${booking.serviceName}`}
        accessibilityHint='Double tap to view booking details'
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
