import { RefObject, useRef } from "react";

import { MapRef } from "@/types/map";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";

export const useCustomPinNavigation = () => {
  const { setStoryLocation, setSavedStorySpot, resetSavedStorySpot } =
    useStoryAddStore();

  const PIN_RATIO_FROM_TOP = 0.3;
  const PIN_OFFSET_FROM_CENTER = 0.5 - PIN_RATIO_FROM_TOP;

  const latDeltaRef = useRef<number | null>(null);
  const lngDeltaRef = useRef<number | null>(null);

  //위도, 경도가 커스텀 핀 아래 오도록 지도 이동
  const moveToCustomPinLocation = (
    mapRef: RefObject<MapRef | null>,
    targetLat: number,
    targetLng: number
  ) => {
    const latDelta = latDeltaRef.current ?? 0.01;
    const lngDelta = lngDeltaRef.current ?? 0.01;

    const adjustedLat = targetLat - latDelta * PIN_OFFSET_FROM_CENTER;

    (mapRef.current?.moveToLocation({
      latitude: adjustedLat,
      longitude: targetLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    }),
      setStoryLocation(targetLat, targetLng));
  };

  // 지도 움직였을 때, 커스텀 핀 위치에 있는 coordinate 계산
  const getCustomPinLoction = (bounds: {
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
  }) => {
    const centerLat = (bounds.minLatitude + bounds.maxLatitude) / 2;
    const centerLng = (bounds.minLongitude + bounds.maxLongitude) / 2;

    const latDelta = bounds.maxLatitude - bounds.minLatitude;
    const lngDelta = bounds.maxLongitude - bounds.maxLongitude;

    latDeltaRef.current = latDelta;
    lngDeltaRef.current = lngDelta;

    const pinLat = centerLat + latDelta * PIN_OFFSET_FROM_CENTER;

    setStoryLocation(pinLat, centerLng);

    return { latitude: pinLat, longitude: centerLng };
  };

  //마커 선택&검색 정보 선택 시 정보 저장
  const setSelectedSpot = (
    id: number | undefined,
    title: string | undefined
  ) => {
    setSavedStorySpot(id, title);
  };

  return { moveToCustomPinLocation, getCustomPinLoction, setSelectedSpot };
};
