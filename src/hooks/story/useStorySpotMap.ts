import { useCallback, useState } from "react";

import { Keyboard } from "react-native";
import { BoundingBox } from "react-native-maps";

import {
  GetSearchTitleRequest,
  GetSpotInMapRequest,
  GetStoryInMapRequest,
  SpotsItemInMap,
  SpotsListInMap,
  StoryInMapResponse,
  storySpots,
} from "@/types/storySpot";

import { KOREA_GEOM } from "@/constants/geometry";

import {
  getSearchStory,
  getSpotInfo,
  getSpotListInMap,
  getStoryListInMap,
} from "@/api/getStoryApi";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useLocationStore } from "@/store/useLocationStore";

export const useStorySpotMap = () => {
  const { setSpotListInMap, selectedStorySpot, setStoryListInMap } =
    useStoryStore();

  const location = useLocationStore((state) => state.location);

  const [searchResults, setSearchResults] = useState<storySpots[]>([]);

  //지도상에 있는 마커들의 위치 정보 가져오기
  const fetchSpotMarkerInMap = useCallback(
    async (param: GetSpotInMapRequest) => {
      try {
        const response: SpotsListInMap = await getSpotListInMap(param);
        setSpotListInMap(response.storySpots);
        return response;
      } catch (error) {
        console.error("fetchSpotMarkerInMap 에러");
        return undefined;
      }
    },
    [setSpotListInMap]
  );

  // 지도상에 있는 마커들의 게시글 내용 받아오기
  const fetchStoryListInMap = useCallback(
    async (param: GetStoryInMapRequest) => {
      try {
        const response: StoryInMapResponse = await getStoryListInMap(param);
        setStoryListInMap(response.stories ?? []);
        return response;
      } catch (error) {
        console.error("fetchStoryListInMap 에러");
        return undefined;
      }
    },
    []
  );

  //main 지도 이동 시 위치저장
  const handleRegionChange = useCallback(
    (bounds: {
      minLongitude: number;
      minLatitude: number;
      maxLongitude: number;
      maxLatitude: number;
    }) => {
      const spotInMapRequest: GetStoryInMapRequest = {
        minLongitude: bounds.minLongitude,
        minLatitude: bounds.minLatitude,
        maxLongitude: bounds.maxLongitude,
        maxLatitude: bounds.maxLatitude,
        page: 0,
        size: 10,
        sort: "createdAt,desc",
      };
      fetchStoryListInMap(spotInMapRequest);
    },

    [fetchStoryListInMap]
  );

  //지도 bounding 한 위치
  const fetchStorySpotInBoundingBox = useCallback(
    (boundingBox: BoundingBox) => {
      fetchSpotMarkerInMap({
        minLatitude: boundingBox.southWest.latitude,
        minLongitude: boundingBox.southWest.longitude,
        maxLatitude: boundingBox.northEast.latitude,
        maxLongitude: boundingBox.northEast.longitude,
      });
      handleRegionChange({
        minLatitude: boundingBox.southWest.latitude,
        minLongitude: boundingBox.southWest.longitude,
        maxLatitude: boundingBox.northEast.latitude,
        maxLongitude: boundingBox.northEast.longitude,
      });
    },
    [fetchSpotMarkerInMap, handleRegionChange]
  );

  // 스토리 마커 선택 시
  const fetchSpotDetail = useCallback(
    async (spotInfo: SpotsItemInMap) => {
      try {
        const spotRequest = {
          storySpotId: spotInfo.storySpotId,
          query: {
            query: {
              longitude: spotInfo.longitude,
              latitude: spotInfo.latitude,
              locale: "KO" as const,
              page: 0,
              size: 1000,
              sort: "createdAt,desc" as const,
            },
          },
        };
        const spotDeatil = await getSpotInfo(spotRequest);
        selectedStorySpot([spotDeatil]);
        return spotDeatil;
      } catch (error) {
        return undefined;
      }
    },
    [selectedStorySpot]
  );

  // 스팟 검색만
  const OnSpotSearch = useCallback(
    (spotTitle: string) => {
      if (!spotTitle.trim()) {
        setSearchResults([]);
        return;
      } else {
        fetchSearchedSpotInfo(spotTitle, {
          longitude: location.longitude,
          latitude: location.latitude,
        });
      }
    },
    [location.longitude, location.latitude]
  );

  //검색한 스팟 선택 시
  const fetchSearchedSpotInfo = async (
    keyword: string,
    currentLocation: { longitude: number; latitude: number }
  ) => {
    Keyboard.dismiss();
    try {
      const searchParams: GetSearchTitleRequest = {
        keyword: keyword,
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
        minLongitude: KOREA_GEOM.LOGITUDE.MIN,
        minLatitude: KOREA_GEOM.LATITUDE.MIN,
        maxLongitude: KOREA_GEOM.LOGITUDE.MAX,
        maxLatitude: KOREA_GEOM.LATITUDE.MAX,
        limit: "10",
      };
      const searchedSpot = await getSearchStory(searchParams);
      setSearchResults(searchedSpot.storySpots);
    } catch (error) {
      throw error;
    }
  };

  return {
    // selectedMarkerId,
    searchResults,

    //액션
    fetchSpotDetail,
    fetchStoryListInMap,
    fetchSpotMarkerInMap,
    fetchSearchedSpotInfo,

    //상태
    fetchStorySpotInBoundingBox,
    OnSpotSearch,
  };
};
