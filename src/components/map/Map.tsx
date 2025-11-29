import React, { useCallback, useRef } from "react";

import { StyleSheet, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import { useLocation } from "@/hooks/useLocation";

import { theme } from "@/styles/theme";

const LOCATION_BUTTON_SIZE = 48;
const LOCATION_BUTTON_MARGIN = 16;

interface MapProps {
  animatedPosition?: SharedValue<number>;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Map: React.FC<MapProps> = ({ animatedPosition }) => {
  const mapRef = useRef<MapView>(null);
  const { location, isLoading, getCurrentLocation } = useLocation();

  const moveToCurrentLocation = useCallback(async () => {
    const coords = await getCurrentLocation();
    mapRef.current?.animateToRegion(coords, 300);
  }, [getCurrentLocation]);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    if (!animatedPosition) {
      return { bottom: LOCATION_BUTTON_MARGIN };
    }

    const translateY =
      animatedPosition.value - (LOCATION_BUTTON_SIZE + LOCATION_BUTTON_MARGIN);
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
      />
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
};

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
