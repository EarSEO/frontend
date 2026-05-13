import { useCallback, useRef, useState } from "react";

import { BoundingBox } from "react-native-maps";

import { RectangleBoundsParams, SightInfo } from "@/types/sight";

import { getSightDetail, getSightsInRectangle } from "@/api/sight/getSight";
import { useLocationStore } from "@/store/common/useLocationStore";
import { useSightStore } from "@/store/sight/useSightStore";

export const useSightMap = () => {
  const {
    setSights,
    selectSight,
    setSightDetail,
    setLoading,
    setDetailLoading,
    setError,
    clearSelection,
  } = useSightStore();

  //현재 지도 상 위치
  const location = useLocationStore((state) => state.location);

  // 디바운스용 타이머 ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 지도 영역 내 관광지마커 조회 (기존 코드 유지)
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

  //지도에서 bounding한 위치
  const fetchSightInBoundingBox = useCallback(
    (boundingBox: BoundingBox, delay = 300) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        const bounds: RectangleBoundsParams = {
          minLatitude: boundingBox.southWest.latitude,
          minLongitude: boundingBox.southWest.longitude,
          maxLatitude: boundingBox.northEast.latitude,
          maxLongitude: boundingBox.northEast.longitude,
        };
        fetchSightsInBounds(bounds);
      }, delay);
    },
    [fetchSightsInBounds]
  );

  // 관광지 상세 조회 (기존 코드 유지)
  const fetchSightDetail = useCallback(
    async (sight: SightInfo) => {
      try {
        if (!location) {
          return;
        }
        selectSight(sight);
        setDetailLoading(true);

        const detail = await getSightDetail({
          id: sight.id,
          longitude: location.longitude,
          latitude: location.latitude,
        });
        setSightDetail(detail);
      } catch (err) {
        console.error("관광지 상세 조회 실패:", err);
        setError("상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setDetailLoading(false);
      }
    },
    [selectSight, setSightDetail, location, setDetailLoading, setError]
  );

  // 마커 선택 해제 (기존 코드 유지)
  const deselectSight = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return {
    // 액션
    fetchSightsInBounds,
    fetchSightInBoundingBox,
    fetchSightDetail,
    deselectSight,
  };
};
