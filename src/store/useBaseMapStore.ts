import React from "react";

import MapView, {Address, BoundingBox, LatLng, Region} from "react-native-maps";
import {Point} from "react-native-maps/src/sharedTypes";

import {devtools} from "@csark0812/zustand-expo-devtools";
import {create} from "zustand";

const SEOUL_CITY_HALL = {
  latitude: 37.5666805,
  longitude: 126.9784147,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
} as Region;

interface BaseMapStore {
  mapRef: React.RefObject<MapView | null> | undefined;

  mapComponent: React.ReactNode;
  setMapComponent: (mapComponent: React.ReactNode) => void;

  enableCluster: boolean;
  setEnableCluster: (enableCluster: boolean) => void;

  mapMovable: boolean;
  setMapMovable: (mapMovable: boolean) => void;

  isMapFollowingUser: boolean;
  setIsMapFollowingUser: (isMapFollowingUser: boolean) => void;

  locationButtonVisible: boolean;
  setLocationButtonVisible: (locationButtonVisible: boolean) => void;

  currentMapBoundingBox: BoundingBox | undefined;
  setCurrentMapBoundingBox: (bounds: BoundingBox) => void;

  regionChangeCompleteMethod: ((boundingBox: BoundingBox) => void) | undefined;
  setRegionChangeCompleteMethod: (regionChangeCompleteMethod: ((boundingBox: BoundingBox) => void) | undefined) => void;

  regionChangeDebounceTimer: NodeJS.Timeout | null;
  startRegionChangeDebounce: (callback: () => void, delay: number) => void;
  clearRegionChangeDebound: () => void;

  centerPinPoint: Point | undefined;
  setCenterPinPoint: (centerPinPoint: Point) => void;
  getCenterPinCoordinate: () => Promise<LatLng | undefined>;
  getCenterPinAddress: () => Promise<Address | undefined>;

  centerPinVisibility: boolean;
  setCenterPinVisibility: (visible: boolean) => void;
}

export const useBaseMapStore = create<BaseMapStore>()(devtools((set, get) => ({
  mapRef: React.createRef<MapView>(),

  mapComponent: undefined,
  setMapComponent: (mapComponent: React.ReactNode) => {
    set({mapComponent}, false, "setMapComponent");
  },

  enableCluster: true,
  setEnableCluster: (enableCluster: boolean) => {
    set({enableCluster}, false, "setEnableCluster");
  },

  mapMovable: true,
  setMapMovable: (mapMovable) => {
    set({mapMovable}, false, "setMapMovable");
  },

  isMapFollowingUser: false,
  setIsMapFollowingUser: (isMapFollowingUser: boolean) => {
    set({isMapFollowingUser}, false, "isMapFollowingUser");
  },

  locationButtonVisible: true,
  setLocationButtonVisible: (locationButtonVisible: boolean) => {
    set({locationButtonVisible})
  },

  currentMapBoundingBox: undefined,
  setCurrentMapBoundingBox: (currentMapBoundingBox) => {
    set({currentMapBoundingBox}, false, "setCurrentMapBoundingBox");
  },

  regionChangeCompleteMethod: undefined,
  setRegionChangeCompleteMethod: (regionChangeCompleteMethod: ((boundingBox: BoundingBox) => void) | undefined) => {
    set({regionChangeCompleteMethod}, false, "setRegionChangeCompleteMethod");
  },

  regionChangeDebounceTimer: null,
  startRegionChangeDebounce: (callback, delay) => {
    const {regionChangeDebounceTimer} = get();
    if(regionChangeDebounceTimer) {
      clearTimeout(regionChangeDebounceTimer);
    }
    const timer = setTimeout(callback, delay);
    set({regionChangeDebounceTimer: timer}, false, "startRegionChangeDebounce");
  },
  clearRegionChangeDebound: () => {
    const {regionChangeDebounceTimer} = get();
    if(regionChangeDebounceTimer) {
      clearTimeout(regionChangeDebounceTimer);
      set({regionChangeDebounceTimer: null}, false, "clearRegionChangeDebound");
    }
  },

  centerPinPoint: undefined,
  setCenterPinPoint: (centerPinPoint) => {
    set({centerPinPoint}, false, "setCenterPinPoint");
  },
  getCenterPinCoordinate: async () => {
    const centerPinPoint = get().centerPinPoint;
    const mapRef = get().mapRef;
    if(!mapRef || !centerPinPoint) return undefined;
    return mapRef.current?.coordinateForPoint(centerPinPoint);
  },
  getCenterPinAddress: async () => {
    const coordinate = await get().getCenterPinCoordinate();
    const mapRef = get().mapRef;
    if(!mapRef || !coordinate) return undefined;
    return mapRef.current?.addressForCoordinate(coordinate);
  },

  centerPinVisibility: true,
  setCenterPinVisibility: (centerPinVisibility) => {
    set({centerPinVisibility}, false, "setCenterPinVisibility");
  },
}), {
  // 주스탠드 스토어 관측성
  name: "useBaseMapStore",
  serialize: {
    replacer: (key: string, value: unknown) => {
      if (key === "mapRef") {
        return value !== null ? "[mapRef: active]" : "[mapRef: null]";
      }

      if (value && typeof value === "object" && "current" in value) {
        const ref = value as React.RefObject<unknown>;
        const typeName = ref.current?.constructor?.name ?? "null";
        return `[Ref: ${typeName}]`;
      }

      // React Node -> 컴포넌트 이름 또는 태그명 표시
      if (React.isValidElement(value)) {
        const type = value.type;
        const name =
          typeof type === "string"
            ? type
            : (type as React.ComponentType)?.displayName ??
            (type as React.ComponentType)?.name ??
            "Unknown";
        return `[ReactNode: <${name}>]`;
      }

      // Timer -> 활성 여부 표시
      if (key === "regionChangeDebounceTimer") {
        return value !== null ? "[Timer: active]" : "[Timer: null]";
      }

      // 함수 -> 함수 이름 표시
      if (typeof value === "function") {
        return `[Function: ${value.name || "anonymous"}]`;
      }

      return value;
    },
  },
}))
