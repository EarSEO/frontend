import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";

import { StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import { useLocation } from "@/hooks/useLocation";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";

import { theme } from "@/styles/theme";

const LOCATION_BUTTON_SIZE = 48;
const LOCATION_BUTTON_MARGIN = 16;

interface MapProps {
  animatedPosition?: SharedValue<number>;
  markers?: SightInfo[];
  selectedMarkerId?: string | null;
  onMarkerPress?: (sight: SightInfo) => void;
  onRegionChangeComplete?: (bounds: {
    minLongitude: number;
    minLatitude: number;
    maxLongitude: number;
    maxLatitude: number;
  }) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Map = forwardRef<MapRef, MapProps>(
  (
    {
      animatedPosition,
      markers,
      selectedMarkerId,
      onMarkerPress,
      onRegionChangeComplete,
    },
    ref,
  ) => {
    const mapRef = useRef<MapView>(null);
    const { location, isLoading, getCurrentLocation } = useLocation();

    useImperativeHandle(ref, () => ({
      getBoundaries: async () => {
        if (!mapRef.current) return null;
        const boundaries = await mapRef.current.getMapBoundaries();
        return boundaries;
      },
      fitToPoints: (points) => {
        if (!mapRef.current || points.length === 0) return;
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      },
      moveToLocation: (location) => {
        if (!mapRef.current) return;
        mapRef.current.animateToRegion(location, 300);
      },
    }));

    const moveToCurrentLocation = useCallback(async () => {
      const coords = await getCurrentLocation();
      mapRef.current?.animateToRegion(coords, 300);
    }, [getCurrentLocation]);

    const handleRegionChangeComplete = useCallback(async () => {
      if (!mapRef.current || !onRegionChangeComplete) return;

      const boundaries = await mapRef.current.getMapBoundaries();
      if (!boundaries) return;

      onRegionChangeComplete({
        minLongitude: boundaries.southWest.longitude,
        minLatitude: boundaries.southWest.latitude,
        maxLongitude: boundaries.northEast.longitude,
        maxLatitude: boundaries.northEast.latitude,
      });
    }, [onRegionChangeComplete]);

    const buttonAnimatedStyle = useAnimatedStyle(() => {
      if (!animatedPosition) {
        return { bottom: LOCATION_BUTTON_MARGIN };
      }

      const translateY =
        animatedPosition.value -
        (LOCATION_BUTTON_SIZE + LOCATION_BUTTON_MARGIN);
      return { top: 0, transform: [{ translateY }] };
    });

    if (isLoading) {
      return null;
    }

    return (
      <>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={location}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {markers?.map((sight) => (
            <Marker
              key={sight.id}
              coordinate={{
                latitude: sight.latitude,
                longitude: sight.longitude,
              }}
              title={sight.title}
              pinColor={
                selectedMarkerId === sight.id
                  ? theme.colors.main.primary
                  : "#FF6B6B"
              }
              onPress={() => onMarkerPress?.(sight)}
            />
          ))}
        </MapView>
        <AnimatedTouchable
          style={[styles.locationButton, buttonAnimatedStyle]}
          onPress={moveToCurrentLocation}
          activeOpacity={0.8}
        >
          <Ionicons
            name="locate"
            size={24}
            color={theme.colors.grey.neutral600}
          />
        </AnimatedTouchable>
      </>
    );
  },
);

Map.displayName = "Map";

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  locationButton: {
    position: "absolute",
    right: 16,
    width: LOCATION_BUTTON_SIZE,
    height: LOCATION_BUTTON_SIZE,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default Map;
