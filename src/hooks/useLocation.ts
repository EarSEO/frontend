import { useCallback, useEffect, useState } from "react";

import {Region} from "react-native-maps";

import * as Location from "expo-location";

import {useLocationStore} from "@/store/useLocationStore";

const SEOUL_CITY_HALL = {
  latitude: 37.5666805,
  longitude: 126.9784147,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export interface CurrentLocation {
  isLoading: boolean;
  getCurrentLocation: () => Promise<Region>;
}

export const useLocation = (): CurrentLocation => {
  const {setLocation} = useLocationStore();
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return SEOUL_CITY_HALL;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const currentRegion = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      } as Region;
      setLocation(currentRegion);
      return currentRegion;
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
    isLoading,
    getCurrentLocation,
  };
};
