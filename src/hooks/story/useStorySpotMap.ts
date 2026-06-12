import { useCallback, useRef, useState } from "react";

import { BoundingBox } from "react-native-maps";
import { LatLng } from "react-native-maps/src/sharedTypes";

import { RectangleBoundsParams } from "@/types/sight";
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

  const [isLoading, setIsLoading] = useState<boolean>();

  // 디바운스용 타이머 ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const location = useLocationStore((state) => state.location);

  //지도상에 있는 마커들의 위치 정보 가져오기
  const fetchSpotMarkerInMap = useCallback(
    async (param: GetSpotInMapRequest) => {
      try {
        const response: SpotsListInMap = await getSpotListInMap(param);
        setSpotListInMap(response.storySpots);
        return response;
      } catch (error) {
        console.error("fetchSpotMarkerInMap 에러", error);
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

  //지도 bounding 한 위치
  const fetchStorySpotInBoundingBox = useCallback(
    (boundingBox: BoundingBox) => {
      const latDiff =
        boundingBox.northEast.latitude - boundingBox.southWest.latitude;
      if (latDiff > 5) {
        return;
      }
      const bounds: RectangleBoundsParams = {
        minLatitude: boundingBox.southWest.latitude,
        minLongitude: boundingBox.southWest.longitude,
        maxLatitude: boundingBox.northEast.latitude,
        maxLongitude: boundingBox.northEast.longitude,
      };

      fetchSpotMarkerInMap(bounds);
      const spotInMapRequest: GetStoryInMapRequest = {
        minLatitude: boundingBox.southWest.latitude,
        minLongitude: boundingBox.southWest.longitude,
        maxLatitude: boundingBox.northEast.latitude,
        maxLongitude: boundingBox.northEast.longitude,
        page: 0,
        size: 10,
        sort: "createdAt,desc",
      };
      fetchStoryListInMap(spotInMapRequest);
    },
    [fetchSpotMarkerInMap, fetchStoryListInMap]
  );

  // 스토리 마커 선택 시
  const fetchSpotDetail = useCallback(
    async (spotInfo: BriefSpotInfo) => {
      const spotRequest = {
        storySpotId: spotInfo.storySpotId,
        query: {
          query: {
            longitude: location.longitude,
            latitude: location.latitude,
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
