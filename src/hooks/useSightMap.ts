import { useCallback, useRef, useState } from "react";

import {BoundingBox} from "react-native-maps";

import {
  RectangleBoundsParams,
  SearchSightParams,
  SightInfo,
} from "@/types/sight";

import { getSearchSight } from "@/api/sight/getSearchSight";
import { getSightDetail, getSightsInRectangle } from "@/api/sight/getSight";
import { useSightStore } from "@/store/useSightStore";

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

  // 검색 관련 상태
  const [searchResults, setSearchResults] = useState<SightInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 디바운스용 타이머 ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 영역 내 관광지 조회 (기존 코드 유지)
  const fetchSightsInBounds = useCallback(
    async (bounds: RectangleBoundsParams) => {
      try {
        if(bounds.maxLongitude === bounds.minLongitude || bounds.maxLatitude === bounds.minLatitude) return;
        setLoading(true);
        setError(null);
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

  const fetchSightInBoundingBox = useCallback((boundingBox: BoundingBox) => {
    fetchSightsInBounds({
      minLatitude: boundingBox.southWest.latitude,
      minLongitude: boundingBox.southWest.longitude,
      maxLatitude: boundingBox.northEast.latitude,
      maxLongitude: boundingBox.northEast.longitude,
    });
  }, [fetchSightsInBounds]);

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

  // 관광지 검색
  const searchSightsInBounds = useCallback(
    async (
      keyword: string,
      currentLocation: { longitude: number; latitude: number },
      bounds: RectangleBoundsParams,
      limit: number = 20
    ) => {
      if (!keyword.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError(null);

        const params: SearchSightParams = {
          keyword,
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
          minLongitude: bounds.minLongitude,
          minLatitude: bounds.minLatitude,
          maxLongitude: bounds.maxLongitude,
          maxLatitude: bounds.maxLatitude,
          limit: limit,
        };

        const results = await getSearchSight(params);
        const mapped: SightInfo[] = results.map((item: any) => ({
          id: item.sightId, // ← sightId 를 id 로 변환
          title: item.title,
          longitude: item.longitude,
          latitude: item.latitude,
          geoHash: item.geoHash ?? "",
        }));

        setSearchResults(mapped);
      } catch (err) {
        console.error("관광지 검색 실패:", err);
        setSearchError("검색에 실패했습니다.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // 디바운스 적용된 검색 (입력 중 실시간 검색용)
  const searchSightsDebounced = useCallback(
    (
      keyword: string,
      currentLocation: { longitude: number; latitude: number },
      bounds: RectangleBoundsParams,
      delay = 500
    ) => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }

      if (!keyword.trim()) {
        setSearchResults([]);
        return;
      }

      searchDebounceTimer.current = setTimeout(() => {
        searchSightsInBounds(keyword, currentLocation, bounds);
      }, delay);
    },
    [searchSightsInBounds]
  );

  // 검색 결과 초기화
  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

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
          id: sight.id,
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

    // 검색 상태
    searchResults,
    isSearching,
    searchError,

    // 액션
    fetchSightsInBounds,
    fetchSightInBoundingBox,
    fetchSightsDebounced,
    fetchSightDetail,
    deselectSight,

    // 검색 액션
    searchSightsInBounds,
    searchSightsDebounced,
    clearSearchResults,
  };
};
