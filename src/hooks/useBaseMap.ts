import {useCallback, useEffect} from "react";

import {GestureResponderEvent} from "react-native";
import {BoundingBox, Details, Region} from "react-native-maps";

import {SNAP_POINT_TYPE} from "@gorhom/bottom-sheet";

import {Point} from "@/types/geom";

import {useBaseMapStore} from "@/store/useBaseMapStore";
import {useBottomSheetStore} from "@/store/useBottomSheetStore";
import {useLocationStore} from "@/store/useLocationStore";

export const useBaseMap = () => {
  const {setIsMapFollowingUser, setLocationButtonVisible} = useBaseMapStore();

  const getCurMapRef = useCallback(() => {
      return useBaseMapStore.getState().mapRef;
  }, []);

  const moveToRegion = useCallback(async (region: Region, duration = 300) => {
    const mapRef = getCurMapRef();
    if (!mapRef?.current) return;
    setIsMapFollowingUser(false);
    await new Promise(resolve => setTimeout(resolve, 50));
    mapRef.current.animateToRegion(region, duration);
  }, []);

  const getBoundaries = useCallback(async () => {
    const mapRef = getCurMapRef();
    if (!mapRef?.current) return null;
    return await mapRef.current.getMapBoundaries();
  }, []);

  const fitToPoints = useCallback((points: Point[]) => {
    const mapRef = getCurMapRef();
    if (!mapRef?.current || points.length === 0) return;
    mapRef.current.fitToCoordinates(points, {
      edgePadding: {top: 100, right: 15, bottom: 15, left: 15},
      animated: true,
    });
  }, []);

  const moveToCurrentLocation = useCallback(async (duration: number = 300) => {
    const mapRef = getCurMapRef();
    const location = useLocationStore.getState().location;
    mapRef?.current?.animateCamera({
      center: location
    }, {duration});
  }, []);

  const setCameraFollow = useCallback((shouldFollow: boolean) => {
    if(shouldFollow) {
      useBaseMapStore.getState().setIsMapFollowingUser(true);
      moveToCurrentLocation();
    }
    else {
      useBaseMapStore.getState().setIsMapFollowingUser(false);
    }
  }, []);

  const onPressLocateButton = useCallback((event: GestureResponderEvent) => {
    event.stopPropagation();
    const shouldFollow = !useBaseMapStore.getState().isMapFollowingUser;
    setCameraFollow(shouldFollow);
  }, [moveToCurrentLocation]);

  const onRegionChange = useCallback((region: Region) => {
    useBaseMapStore.getState().setCurrentMapRegion(region);
  }, []);

  // 지도의 RegionChangeComplete 이벤트 기준 마커 로드
  // @ts-ignore
  const onRegionChangeCompleteWithRegion = useCallback((region: Region, details: Details, markers: Marker[] | undefined, delay = 300) => {
    useBaseMapStore.getState().startRegionChangeDebounce(async () => {
      const regionChangeCompleteMethod = useBaseMapStore.getState().regionChangeCompleteMethod;
      const currentMapRegion = useBaseMapStore.getState().currentMapRegion;
      if (currentMapRegion && regionChangeCompleteMethod) {
        regionChangeCompleteMethod(regionToBoundingBox(currentMapRegion));
      }
    }, delay);
  }, []);

  // 현재 지도의 MapBoundary 기준 마커 로드
  const onRegionChangeCompleteWithBoundingBox = useCallback((delay = 300) => {
    useBaseMapStore.getState().startRegionChangeDebounce(async () => {
      const regionChangeCompleteMethod = useBaseMapStore.getState().regionChangeCompleteMethod;
      const mapBoundaries = await getCurMapRef()?.current?.getMapBoundaries();
      if (mapBoundaries && regionChangeCompleteMethod) {
        regionChangeCompleteMethod(mapBoundaries);
        useBaseMapStore.getState().setCurrentMapRegion(boundingBoxToRegion(mapBoundaries));
      }
    }, delay);
  }, []);

  const {setOnBottomSheetChange, setOnBottomSheetAnimate} = useBottomSheetStore();
  const initBaseMapBottomSheetCallbacks = useCallback(() => {
    setOnBottomSheetChange((index: number, position: number, type: SNAP_POINT_TYPE) => { // 간헐적으로 이벤트가 발생하지 않는 이슈 있음
      if (useBaseMapStore.getState().isMapFollowingUser) {
        setIsMapFollowingUser(false);
      }
      if(index > 1) {
        setLocationButtonVisible(false);
      }
      else {
        setLocationButtonVisible(true);
      }
      onRegionChangeCompleteWithBoundingBox();
    })
    setOnBottomSheetAnimate((fromIndex, toIndex) => { // 간헐적으로 index가 반대로 찍히는 이슈 있음
      if (useBaseMapStore.getState().isMapFollowingUser) {
        setIsMapFollowingUser(false);
      }
      if(toIndex > 1) {
        setLocationButtonVisible(false);
        return;
      }
      setLocationButtonVisible(true);
      onRegionChangeCompleteWithBoundingBox();
    })
  }, []);

  useEffect(() => {
    return () => {
      useBaseMapStore.getState().clearRegionChangeDebound();
    }
  }, []);

  return {
    moveToRegion,
    getBoundaries,
    fitToPoints,
    moveToCurrentLocation,
    setCameraFollow,
    onPressLocateButton,
    onRegionChange,
    onRegionChangeCompleteWithRegion,
    onRegionChangeCompleteWithBoundingBox,
    initBaseMapBottomSheetCallbacks,
  };
}

const regionToBoundingBox = (region: Region): BoundingBox => {
  return {
    northEast: {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    },
    southWest: {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    },
  } as BoundingBox;
};

const boundingBoxToRegion = (boundingBox: BoundingBox): Region => {
  const {northEast, southWest} = boundingBox;

  return {
    latitude: (northEast.latitude + southWest.latitude) / 2,
    longitude: (northEast.longitude + southWest.longitude) / 2,
    latitudeDelta: Math.abs(northEast.latitude - southWest.latitude),
    longitudeDelta: Math.abs(northEast.longitude - southWest.longitude),
  } as Region;
};
