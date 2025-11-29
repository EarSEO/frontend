import { useCallback,useEffect, useState } from "react";

import * as Location from "expo-location";

const SEOUL_CITY_HALL = {
  latitude: 37.5666805,
  longitude: 126.9784147,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const useLocation = () => {
  const [location, setLocation] = useState(SEOUL_CITY_HALL);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return SEOUL_CITY_HALL;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    } catch (error) {
      return SEOUL_CITY_HALL;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const coords = await getCurrentLocation();
      setLocation(coords);
      setIsLoading(false);
    };
    init();
  }, [getCurrentLocation]);

  return {
    location,
    isLoading,
    getCurrentLocation,
  };
};