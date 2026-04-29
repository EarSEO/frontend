import { useCallback, useRef, useState } from "react";

import { BoundingBox } from "react-native-maps";

import { RectangleBoundsParams, SightInfo } from "@/types/sight";

import { getSightDetail, getSightsInRectangle } from "@/api/sight/getSight";
import { useSightStore } from "@/store/sight/useSightStore";

export const useSightMap = () => {
  const {
    sights,
    selectedSight,
    sightDetail,
    isLoading,
    isDetailLoading,
    error,
    setSights,
    selectSight,
    setSightDetail,
    setLoading,
    setDetailLoading,
    setError,
    clearSelection,
  } = useSightStore();

  // 디바운스용 타이머 ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 영역 내 관광지 조회 (기존 코드 유지)
  const fetchSightsInBounds = useCallback(
    async (bounds: RectangleBoundsParams) => {
      try {
        if (
          bounds.maxLongitude === bounds.minLongitude ||
          bounds.maxLatitude === bounds.minLatitude
        )
          return;
        setLoading(true);
        setError(undefined);
        const result = await getSightsInRectangle(bounds);
        setSights(result);
      } catch (err) {
        console.error("관광지 목록 조회 실패:", err);
        setError("관광지 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [setSights, setLoading, setError]
  );

  const fetchSightInBoundingBox = useCallback(
    (boundingBox: BoundingBox) => {
      fetchSightsInBounds({
        minLatitude: boundingBox.southWest.latitude,
        minLongitude: boundingBox.southWest.longitude,
        maxLatitude: boundingBox.northEast.latitude,
        maxLongitude: boundingBox.northEast.longitude,
      });
    },
    [fetchSightsInBounds]
  );

  // 디바운스 적용된 조회 (기존 코드 유지)
  const fetchSightsDebounced = useCallback(
    (bounds: RectangleBoundsParams, delay = 300) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        fetchSightsInBounds(bounds);
      }, delay);
    },
    [fetchSightsInBounds]
  );

  // 관광지 상세 조회 (기존 코드 유지)
  const fetchSightDetail = useCallback(
    async (
      sight: SightInfo,
      currentLocation: { longitude: number; latitude: number }
    ) => {
      try {
        selectSight(sight);
        setDetailLoading(true);

        const detail = await getSightDetail({
          id: sight.sightId,
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
        });

        setSightDetail(detail);
      } catch (err) {
        console.error("관광지 상세 조회 실패:", err);
        setError("상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setDetailLoading(false);
      }
    },
    [selectSight, setSightDetail, setDetailLoading, setError]
  );

  // 마커 선택 해제 (기존 코드 유지)
  const deselectSight = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return {
    // 상태
    sights,
    selectedSight,
    sightDetail,
    isLoading,
    isDetailLoading,
    error,

    // 액션
    fetchSightsInBounds,
    fetchSightInBoundingBox,
    fetchSightsDebounced,
    fetchSightDetail,
    deselectSight,
  };
};
