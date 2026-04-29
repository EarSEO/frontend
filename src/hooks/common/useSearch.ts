import { useCallback, useRef, useState } from "react";

import { Keyboard } from "react-native";

import { useRouter } from "expo-router";

import { SearchSight, SearchSightParams, SightInfo } from "@/types/sight";
import { BriefSpotInfo, storySpots } from "@/types/storySpot";

import { KOREA_GEOM } from "@/constants/geometry";

import { getSearchSight, getSearchStory } from "@/api/story/getSearchApi";
import { useLocationStore } from "@/store/common/useLocationStore";

import { useSightMap } from "../sight/useSightMap";
import { useStorySpotMap } from "../story/useStorySpotMap";

export const useSearch = () => {
  const router = useRouter();

  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const location = useLocationStore((state) => state.location);

  // 검색 관련 상태
  const [searchResults, setSearchResults] = useState<
    (SearchSight | storySpots)[]
  >([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { fetchSpotDetail } = useStorySpotMap();
  const { fetchSightDetail } = useSightMap();

  const fetchSearchResults = useCallback(
    async (keyword: string) => {
      Keyboard.dismiss();

      try {
        setIsSearching(true);
        setSearchError(null);

        const searchParams: SearchSightParams = {
          keyword,
          longitude: location.longitude,
          latitude: location.latitude,
          minLongitude: KOREA_GEOM.LOGITUDE.MIN,
          minLatitude: KOREA_GEOM.LATITUDE.MIN,
          maxLongitude: KOREA_GEOM.LOGITUDE.MAX,
          maxLatitude: KOREA_GEOM.LATITUDE.MAX,
          limit: 10,
        };

        const [storyResponse, sightResponse] = await Promise.all([
          getSearchStory(searchParams),
          getSearchSight(searchParams),
        ]);

        const mergedResults = [
          ...(storyResponse.storySpots ?? []),
          ...(sightResponse.sights ?? []),
        ];
        setSearchResults(mergedResults);
      } catch (err) {
        console.error("관광지 검색 실패:", err);
        setSearchError("검색에 실패했습니다.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [location.latitude, location.longitude]
  );

  // 디바운스 적용된 검색 (입력 중 실시간 검색용)
  const searchSightsDebounced = useCallback(
    (keyword: string, delay = 500) => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }

      if (!keyword.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      setSearchError(null);

      searchDebounceTimer.current = setTimeout(() => {
        fetchSearchResults(keyword);
      }, delay);
    },
    [fetchSearchResults]
  );

  //검색 기록 선택 시 해당 정보 fetch 해오기
  const fetchSearchedLocation = useCallback(
    (item: SightInfo | BriefSpotInfo) => {
      if ("storySpotId" in item) {
        const storyInfo = {
          longitude: item.longitude,
          latitude: item.latitude,
          storySpotId: item.storySpotId,
        };
        fetchSpotDetail(storyInfo);
      } else if ("sightId" in item) {
        const sightInfo = {
          sightId: item?.sightId,
          title: item?.title,
          longitude: item?.longitude,
          latitude: item?.latitude,
          geoHash: item.geoHash,
        };
        const currentLocation = {
          longitude: location.longitude,
          latitude: location.latitude,
        };

        fetchSightDetail(sightInfo, currentLocation);
      }
    },
    [fetchSightDetail, fetchSpotDetail]
  );

  // 검색 결과 초기화
  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, [setSearchResults]);

  return {
    //sight 검색
    fetchSearchResults,
    searchSightsDebounced,
    fetchSearchedLocation,

    // sight 검색 상태
    searchResults,
    isSearching,
    searchError,

    //story

    clearSearchResults,
  };
};
