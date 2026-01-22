import {LatLng} from "react-native-maps";

import {create} from "zustand";

const SEOUL_CITY_HALL = {
  latitude: 37.5666805,
  longitude: 126.9784147,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

interface LocationStore {
  location: LatLng;
  setLocation: (location: LatLng) => void;
}

export const useLocationStore = create<LocationStore>((set,get) => ({
  location: SEOUL_CITY_HALL,
  setLocation: (location) => {
    set({location});
  },
}))
