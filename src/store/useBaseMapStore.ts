import MapView, {BoundingBox, Region} from "react-native-maps";

import {create} from "zustand";

const SEOUL_CITY_HALL = {
  latitude: 37.5666805,
  longitude: 126.9784147,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
} as Region;

interface BaseMapStore {
  mapRef: React.RefObject<MapView | null> | undefined;
  setMapRef: (mapRef: React.RefObject<MapView | null>) => void;

  mapComponent: React.ReactNode;
  setMapComponent: (mapComponent: React.ReactNode) => void;

  enableCluster: boolean;
  setEnableCluster: (enableCluster: boolean) => void;

  isMapFollowingUser: boolean;
  setIsMapFollowingUser: (isMapFollowingUser: boolean) => void;

  locationButtonVisible: boolean;
  setLocationButtonVisible: (locationButtonVisible: boolean) => void;

  currentMapRegion: Region;
  setCurrentMapRegion: (currentMapRegion: Region) => void;

  regionChangeCompleteMethod: ((boundingBox: BoundingBox) => void) | undefined;
  setRegionChangeCompleteMethod: (regionChangeCompleteMethod: (boundingBox: BoundingBox) => void) => void;

  regionChangeDebounceTimer: NodeJS.Timeout | null;
  startRegionChangeDebounce: (callback: () => void, delay: number) => void;
  clearRegionChangeDebound: () => void;
}

export const useBaseMapStore = create<BaseMapStore>((set, get) => ({
  mapRef: undefined,
  setMapRef: (mapRef: React.RefObject<MapView | null>) => {
    set({mapRef});
  },

  mapComponent: undefined,
  setMapComponent: (mapComponent: React.ReactNode) => {
    set({mapComponent});
  },

  enableCluster: true,
  setEnableCluster: (enableCluster: boolean) => {
    set({enableCluster});
  },

  isMapFollowingUser: false,
  setIsMapFollowingUser: (isMapFollowingUser: boolean) => {
    set({isMapFollowingUser});
  },

  locationButtonVisible: true,
  setLocationButtonVisible: (locationButtonVisible: boolean) => {
    set({locationButtonVisible})
  },

  currentMapRegion: SEOUL_CITY_HALL,
  setCurrentMapRegion: (currentMapRegion: Region) => {
    set({currentMapRegion});
  },

  regionChangeCompleteMethod: undefined,
  setRegionChangeCompleteMethod: (regionChangeCompleteMethod: (boundingBox: BoundingBox) => void) => {
    set({regionChangeCompleteMethod});
  },

  regionChangeDebounceTimer: null,
  startRegionChangeDebounce: (callback, delay) => {
    const {regionChangeDebounceTimer} = get();
    if(regionChangeDebounceTimer) {
      clearTimeout(regionChangeDebounceTimer);
    }
    const timer = setTimeout(callback, delay);
    set({regionChangeDebounceTimer: timer});
  },
  clearRegionChangeDebound: () => {
    const {regionChangeDebounceTimer} = get();
    if(regionChangeDebounceTimer) {
      clearTimeout(regionChangeDebounceTimer);
      set({regionChangeDebounceTimer: null});
    }
  },
}))
