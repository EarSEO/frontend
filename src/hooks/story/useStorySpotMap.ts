import { useCallback, useState } from "react";

import { BoundingBox } from "react-native-maps";

import { useBaseMap } from "@/hooks/useBaseMap";

import {
  GetSpotInMapRequest,
  GetStoryInMapRequest,
  SpotInfo,
  SpotsItemInMap,
  SpotsListInMap,
  StoryInMapResponse,
  StoryListItem,
} from "@/types/storySpot";

import {
  getSpotInfo,
  getSpotListInMap,
  getStoryListInMap,
} from "@/api/getStoryApi";
import { useStoryStore } from "@/store/story/useStoryStore";

export const useStorySpotMap = () => {
  const {
    setSearchStory,
    setSpotListInMap,
    selectedStorySpot,
    setStoryListInMap,
  } = useStoryStore();

  const [selectedMarkerId, setSelectedMarkerId] = useState<
    number | undefined
  >();

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

  //
  // = useCallback((story: MapSpotInfoItem) => {
  // const storyRequest = {
  //   storySpotId: story.storySpotId,
  //   query: {
  //     query: {
  //       longitude: story.longitude,
  //       latitude: story.latitude,
  //       locale: "KO" as const,
  //       page: 0,
  //       size: 1000,
  //       sort: "createdAt,desc" as const,
  //     },
  //   },
  // };
  // }, []);

  // //이야기 검색 시
  // const handleSearch = async () => {
  //   Keyboard.dismiss();
  //   try {
  //     const searchParams: GetSearchTitleRequest = {
  //       keyword: inputSpotName,
  //       longitude: storyLocation.longitude,
  //       latitude: storyLocation.latitude,
  //       minLongitude: KOREA_GEOM.LOGITUDE.MIN,
  //       minLatitude: KOREA_GEOM.LATITUDE.MIN,
  //       maxLongitude: KOREA_GEOM.LOGITUDE.MAX,
  //       maxLatitude: KOREA_GEOM.LATITUDE.MAX,
  //       limit: "10",
  //     };
  //     await setSearchStory(searchParams);
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  function formatDateArray(dateArray: number[] | string | undefined): string {
    if (typeof dateArray === "string") return dateArray;
    if (!dateArray || !Array.isArray(dateArray)) return "";

    const [year, month, day, hour, minute] = dateArray;
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  return {
    selectedMarkerId,

    //액션
    fetchSpotDetail,
    fetchStoryListInMap,
    fetchSpotMarkerInMap,

    //상태

    fetchStorySpotInBoundingBox,
    setSearchStory,
  };
};
