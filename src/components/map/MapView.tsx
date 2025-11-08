import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { MapRegion, BusinessMarker } from '@/services/location';
import { Coordinates } from '@/services/location/locationService';

interface MapViewComponentProps {
  region?: MapRegion;
  markers?: BusinessMarker[];
  userLocation?: Coordinates;
  onRegionChange?: (region: MapRegion) => void;
  onMarkerPress?: (marker: BusinessMarker) => void;
  showUserLocation?: boolean;
  followUserLocation?: boolean;
  style?: any;
}

export const MapViewComponent: React.FC<MapViewComponentProps> = ({
  region,
  markers = [],
  userLocation,
  onRegionChange,
  onMarkerPress,
  showUserLocation = true,
  followUserLocation = false,
  style,
}) => {
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);

  // Animate to region when it changes
  useEffect(() => {
    if (region && mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region]);

  // Animate to user location when it changes and follow is enabled
  useEffect(() => {
    if (followUserLocation && userLocation && mapRef.current) {
      const region = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [userLocation, followUserLocation]);

  const renderBusinessMarker = (marker: BusinessMarker) => {
    const { business, isOpen, rating } = marker.data;

    return (
      <Marker
        key={marker.id}
        coordinate={marker.coordinate}
        title={marker.title}
        description={marker.description}
        onPress={() => onMarkerPress?.(marker)}
      >
        <View
          style={[
            styles.markerContainer,
            { backgroundColor: theme.colors.primary['500'] },
          ]}
        >
          <MaterialCommunityIcons name="car-wash" size={20} color="#FFFFFF" />
          {rating && (
            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: theme.colors.success['500'] },
              ]}
            >
              <MaterialCommunityIcons name="star" size={12} color="#FFFFFF" />
            </View>
          )}
          {isOpen === false && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: theme.colors.error['500'] },
              ]}
            />
          )}
        </View>
      </Marker>
    );
  };

  const renderUserMarker = () => {
    if (!showUserLocation || !userLocation) return null;

    return (
      <Marker
        coordinate={userLocation}
        title="Your Location"
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View
          style={[
            styles.userMarker,
            { backgroundColor: theme.colors.primary['500'] },
          ]}
        >
          <View
            style={[styles.userMarkerInner, { backgroundColor: '#FFFFFF' }]}
          />
        </View>
      </Marker>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        initialRegion={region}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={false} // We handle this with custom marker
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor={theme.colors.primary['500']}
        loadingBackgroundColor={theme.colors.background}
      >
        {/* Render business markers */}
        {markers.map(renderBusinessMarker)}

        {/* Render user location marker */}
        {renderUserMarker()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ratingBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
