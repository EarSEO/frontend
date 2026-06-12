import { LatLng } from "react-native-maps";

import { LocationObjectCoords } from "expo-location/src/Location.types";
import { create } from "zustand";

const SEOUL_CITY_HALL = {
  latitude: 37.5666805,
  longitude: 126.9784147,
};

interface LocationStore {
  location: LatLng;
  setLocation: (location: LatLng) => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  location: SEOUL_CITY_HALL,
  setLocation: (location) => {
    set({ location });
  },
}));
