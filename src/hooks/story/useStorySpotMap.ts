import { useCallback } from "react";

import { BoundingBox } from "react-native-maps";
import { LatLng } from "react-native-maps/src/sharedTypes";

import {
  BriefSpotInfo,
  GetSpotInMapRequest,
  GetStoryInMapRequest,
  SpotsListInMap,
  StoryInMapResponse,
} from "@/types/storySpot";

import {
  getSpotInfo,
  getSpotListInMap,
  getStoryListInMap,
  getStorySpotInfoBrief,
} from "@/api/story/getStoryApi";
import { useLocationStore } from "@/store/common/useLocationStore";
import { useStoryStore } from "@/store/story/useStoryStore";

export const useStorySpotMap = () => {
  const {
    setTitleList,
    setSpotListInMap,
    selectedStorySpot,
    setStoryListInMap,
  } = useStoryStore();

  const location = useLocationStore((state) => state.location);

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
    async (spotInfo: BriefSpotInfo) => {
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
      try {
        const spotDeatil = await getSpotInfo(spotRequest);
        selectedStorySpot([spotDeatil]);
        setTitleList(spotDeatil.spotTitleList);

        return spotDeatil;
      } catch (error) {
        return undefined;
      }
    },
    [selectedStorySpot]
  );

  //sight -> storySpotId 조회
  const fetchStorySpotId = useCallback(
    async (location: LatLng) => {
      try {
        const res = await getStorySpotInfoBrief(location);
        if (location && res) {
          const sightStoryInfo = {
            longitude: location.longitude,
            latitude: location.latitude,
            storySpotId: res.spotId,
          };
          fetchSpotDetail(sightStoryInfo);
        } else return;
      } catch (error) {
        console.error("fetchStorySpotId에러");
      }
    },
    [location, fetchSpotDetail]
  );

  return {
    //액션
    fetchSpotDetail,
    fetchStoryListInMap,
    fetchSpotMarkerInMap,
    fetchStorySpotId,

    //상태
    fetchStorySpotInBoundingBox,
  };
};
