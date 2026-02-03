import {useCallback, useState} from "react";

import * as Location from "expo-location";
import {LocationAccuracy, LocationSubscription} from "expo-location";

import {useLocationStore} from "@/store/useLocationStore";

export interface CurrentLocation {
  isPositionLoading: boolean;
  watchPositionAsync: () => Promise<LocationSubscription | undefined>;
}

export const useLocation = (): CurrentLocation => {
  const [isPositionLoading, setIsPositionLoading] = useState(true);

  const watchPositionAsync = useCallback(async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      setIsPositionLoading(false);
      return;
    }

    return await Location.watchPositionAsync({
      accuracy: LocationAccuracy.BestForNavigation,
      timeInterval: 1000,
      distanceInterval: 5,
    }, (newLocation) => {
      setIsPositionLoading(false);
      useLocationStore.getState().setLocation(newLocation.coords);
    })
  }, []);

  return {
    isPositionLoading,
    watchPositionAsync,
  };
};
