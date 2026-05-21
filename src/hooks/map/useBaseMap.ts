import { useCallback, useEffect } from "react";

import { GestureResponderEvent } from "react-native";
import { BoundingBox, Details, LatLng, Region } from "react-native-maps";
import { Marker } from "react-native-svg";

import { SNAP_POINT_TYPE } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useGlobalSearchParams } from "expo-router";

import { useBottomSheetStore } from "@/store/common/useBottomSheetStore";
import { useLocationStore } from "@/store/common/useLocationStore";
import { useBaseMapStore } from "@/store/map/useBaseMapStore";

export const useBaseMap = () => {
  const { setIsMapFollowingUser, setLocationButtonVisible } = useBaseMapStore();

  const getCurMapRef = useCallback(() => {
    return useBaseMapStore.getState().mapRef;
  }, []);

  // 특정 좌표로 카메라 이동O
  const moveToLocation = useCallback((latLng: LatLng) => {
    const mapRef = getCurMapRef();
    mapRef?.current?.animateCamera({ center: latLng });
  }, []);

  //특정 Region으로 이동 (줌 + 위치 포함) , 수동 이동이라 유저 추적 끄기 X
  const moveToRegion = useCallback(async (region: Region, duration = 300) => {
    const mapRef = getCurMapRef();
    if (!mapRef?.current) return;
    setIsMapFollowingUser(false);
    await new Promise((resolve) => setTimeout(resolve, 50));
    mapRef.current.animateToRegion(region, duration);
  }, []);

  //현재 화면의 지도 경계 가져오기 ?
  const getBoundaries = useCallback(async () => {
    const mapRef = getCurMapRef();
    if (!mapRef?.current) return null;
    return await mapRef.current.getMapBoundaries();
  }, []);

  //여러 좌표를 화면에 맞게 자동 줌 O
  const fitToPoints = useCallback((points: LatLng[]) => {
    const mapRef = getCurMapRef();
    if (!mapRef?.current || points.length === 0) return;
    mapRef.current.fitToCoordinates(points, {
      edgePadding: { top: 100, right: 15, bottom: 15, left: 15 },
      animated: true,
    });
  }, []);

  //현재 위치로 이동 O
  const moveToCurrentLocation = useCallback(async (duration: number = 300) => {
    const mapRef = getCurMapRef();
    const location = useLocationStore.getState().location;
    mapRef?.current?.animateCamera(
      {
        center: location,
      },
      { duration }
    );
  }, []);

  //카메라가 사용자 따라갈지 설정 O
  const setCameraFollow = useCallback((shouldFollow: boolean) => {
    if (shouldFollow) {
      useBaseMapStore.getState().setIsMapFollowingUser(true);
      moveToCurrentLocation();
    } else {
      useBaseMapStore.getState().setIsMapFollowingUser(false);
    }
  }, []);

  //위치 버튼 클릭 시 실행 O
  const onPressLocateButton = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      const shouldFollow = !useBaseMapStore.getState().isMapFollowingUser;
      setCameraFollow(shouldFollow);
    },
    [moveToCurrentLocation]
  );

  //지도 이동 중 계속 호출됨 o
  const onRegionChange = useCallback((region: Region) => {
    const boundingBox = getCurMapRef()?.current?.boundingBoxForRegion(region);
    if (!boundingBox) return;
    useBaseMapStore.getState().setCurrentMapBoundingBox(boundingBox);
  }, []);

  // 지도의 RegionChangeComplete 이벤트 기준 마커 로드
  // @ts-ignore
  //지도가 멈추면서 이벤트 인자로 넘겨준 region
  const onRegionChangeCompleteWithRegion = useCallback(
    (
      region: Region,
      details: Details,
      markers: Marker[] | undefined,
      delay = 300
    ) => {
      useBaseMapStore.getState().startRegionChangeDebounce(async () => {
        const regionChangeCompleteMethod =
          useBaseMapStore.getState().regionChangeCompleteMethod;
        const boundingBox =
          getCurMapRef()?.current?.boundingBoxForRegion(region);
        if (boundingBox && regionChangeCompleteMethod) {
          regionChangeCompleteMethod(boundingBox);
          useBaseMapStore.getState().setCurrentMapBoundingBox(boundingBox);
        }
      }, delay);
    },
    [getCurMapRef]
  );

  // 현재 지도의 MapBoundary 기준 마커 로드
  //native 지도 기반
  const onRegionChangeCompleteWithBoundingBox = useCallback(
    (delay = 300) => {
      useBaseMapStore.getState().startRegionChangeDebounce(async () => {
        const regionChangeCompleteMethod =
          useBaseMapStore.getState().regionChangeCompleteMethod;
        const mapBoundaries = await getCurMapRef()?.current?.getMapBoundaries();
        if (mapBoundaries && regionChangeCompleteMethod) {
          regionChangeCompleteMethod(mapBoundaries);
          useBaseMapStore.getState().setCurrentMapBoundingBox(mapBoundaries);
        }
      }, delay);
    },
    [getCurMapRef]
  );

  // 초기 마커 로드 x
  const loadMarkerFromStore = useCallback(async () => {
    const regionChangeCompleteMethod =
      useBaseMapStore.getState().regionChangeCompleteMethod;
    const mapBoundaries = await getCurMapRef()?.current?.getMapBoundaries();
    if (mapBoundaries && regionChangeCompleteMethod) {
      regionChangeCompleteMethod(mapBoundaries);
      useBaseMapStore.getState().setCurrentMapBoundingBox(mapBoundaries);
    }
  }, []);

  //바텀시트 이벤트 연결
  const { setOnBottomSheetChange, setOnBottomSheetAnimate } =
    useBottomSheetStore();
  const initBaseMapBottomSheetCallbacks = useCallback(() => {
    setOnBottomSheetChange(
      (index: number, position: number, type: SNAP_POINT_TYPE) => {
        // 간헐적으로 이벤트가 발생하지 않는 이슈 있음
        if (useBaseMapStore.getState().isMapFollowingUser) {
          setIsMapFollowingUser(false);
        }
        if (index > 1) {
          setLocationButtonVisible(false);
        } else {
          setLocationButtonVisible(true);
        }
        onRegionChangeCompleteWithBoundingBox();
      }
    );
    setOnBottomSheetAnimate((fromIndex, toIndex) => {
      // 간헐적으로 index가 반대로 찍히는 이슈 있음
      if (useBaseMapStore.getState().isMapFollowingUser) {
        setIsMapFollowingUser(false);
      }
      if (toIndex > 1) {
        setLocationButtonVisible(false);
        return;
      }
      setLocationButtonVisible(true);
      onRegionChangeCompleteWithBoundingBox();
    });
  }, []);

  //위,경도 주소로 반환
  const getAddressFromRegion = async (region: Region) => {
    const result = await Location.reverseGeocodeAsync({
      latitude: region.latitude,
      longitude: region.longitude,
    });

    if (result.length > 0) {
      const addr = result[0];

      return `${addr.region} ${addr.city} ${addr.district} ${addr.street}`;
    }
  };

  useEffect(() => {
    return () => {
      useBaseMapStore.getState().clearRegionChangeDebound();
    };
  }, []);

  return {
    moveToLocation,
    moveToRegion,
    getBoundaries,
    fitToPoints,
    moveToCurrentLocation,
    setCameraFollow,
    onPressLocateButton,
    onRegionChange,
    onRegionChangeCompleteWithRegion,
    onRegionChangeCompleteWithBoundingBox,
    loadMarkerFromStore,
    initBaseMapBottomSheetCallbacks,
    getAddressFromRegion,
  };
};

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
  const { northEast, southWest } = boundingBox;

  return {
    latitude: (northEast.latitude + southWest.latitude) / 2,
    longitude: (northEast.longitude + southWest.longitude) / 2,
    latitudeDelta: Math.abs(northEast.latitude - southWest.latitude),
    longitudeDelta: Math.abs(northEast.longitude - southWest.longitude),
  } as Region;
};
