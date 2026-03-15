import { useCallback, useEffect, useRef, useState } from "react";

import { Keyboard } from "react-native";
import {BoundingBox} from "react-native-maps";

import {useBaseMap} from "@/hooks/useBaseMap";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";
import {
  GetMapStoriesRequest,
  GetSearchTitleRequest,
  MapSpotInfoItem,
} from "@/types/storySpot";

import { KOREA_GEOM } from "@/constants/geometry";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import {useBaseMapStore} from "@/store/useBaseMapStore";

import { useCustomPinNavigation } from "./useCustomPinNavigation";

export const useStorySpotMap = () => {
  const {
    setStoryListInMap,
    setStoryInfo,
    setStoryLocationInMap,
    resetStoryInfo,
    setStorySpotBriefInfo,
    storySpotBriefInfo,
    setSearchStory,
  } = useStoryStore();

  const {moveToLocation} = useBaseMap();

  const { storyLocation } = useStoryAddStore();

  const { moveToCustomPinLocation, setSelectedSpot } = useCustomPinNavigation();

  const mapRef = useRef<MapRef>(null);

  const [selectedMarkerId, setSelectedMarkerId] = useState<
    number | undefined
  >();
  const [inputSpotName, setInputSpotName] = useState<string>("");

  //지도 선택했을 때(마커 선택 취소 시)
  const handleMapPress = useCallback(() => {
    setSelectedMarkerId(undefined);
    resetStoryInfo();
  }, [resetStoryInfo]);

  //main 지도 이동 시 위치저장
  const handleRegionChange = useCallback(
    (bounds: {
      minLongitude: number;
      minLatitude: number;
      maxLongitude: number;
      maxLatitude: number;
    }) => {
      const mapStoriesRequest: GetMapStoriesRequest = {
        minLongitude: bounds.minLongitude.toString(),
        minLatitude: bounds.minLatitude.toString(),
        maxLongitude: bounds.maxLongitude.toString(),
        maxLatitude: bounds.maxLatitude.toString(),
        page: 0,
        size: 10,
        sort: "createdAt,desc",
      };

      setStoryListInMap(mapStoriesRequest);
      setStoryLocationInMap(mapStoriesRequest);
    },
    []
  );

  const fetchStorySpotInBoundingBox = useCallback((boundingBox: BoundingBox) => {
    handleRegionChange({
      minLatitude: boundingBox.southWest.latitude,
      minLongitude: boundingBox.southWest.longitude,
      maxLatitude: boundingBox.northEast.latitude,
      maxLongitude: boundingBox.northEast.longitude,
    });
  }, [handleRegionChange]);

  // 스토리 마커 선택 시
  const handleStoryMarkerPress = useCallback((story: MapSpotInfoItem) => {
    const storyRequest = {
      storySpotId: story.storySpotId,
      query: {
        query: {
          longitude: story.longitude.toString(),
          latitude: story.latitude.toString(),
          locale: "KO" as const,
          page: 0,
          size: 1000,
          sort: "createdAt,desc" as const,
        },
      },
    };
    setStorySpotBriefInfo({
      latitude: String(story.latitude),
      longitude: String(story.longitude),
    });

    setStoryInfo(storyRequest);
    moveToLocation(story);
    // moveToCustomPinLocation(mapRef, story.latitude, story.longitude);
    setSelectedMarkerId(storySpotBriefInfo?.spotId);
  }, []);

  //sight 마커선택 시
  const handleSightMarkerPress = useCallback((sight: SightInfo) => {
    const mapLat = sight.latitude;
    const mapLng = sight.longitude;

    setSelectedSpot(Number(sight.id), sight.title);
    moveToLocation(sight);
    // moveToCustomPinLocation(useBaseMapStore.getState().mapRef, mapLat, mapLng);
  }, []);

  //이야기 검색 시
  const handleSearch = async () => {
    Keyboard.dismiss();
    try {
      if (!storyLocation) {
        return;
      }
      const searchParams: GetSearchTitleRequest = {
        keyword: inputSpotName,
        longitude: storyLocation.longitude,
        latitude: storyLocation.latitude,
        minLongitude: KOREA_GEOM.LOGITUDE.MIN,
        minLatitude: KOREA_GEOM.LATITUDE.MIN,
        maxLongitude: KOREA_GEOM.LOGITUDE.MAX,
        maxLatitude: KOREA_GEOM.LATITUDE.MAX,
        limit: "10",
      };
      await setSearchStory(searchParams);
      setStorySpotBriefInfo({
        latitude: String(storyLocation.latitude),
        longitude: String(storyLocation.longitude),
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    mapRef,
    selectedMarker: selectedMarkerId,
    handleMapPress,
    handleRegionChange,
    fetchStorySpotInBoundingBox,
    handleStoryMarkerPress,
    handleSightMarkerPress,
    setSearchTitle: setSearchStory,
    inputSpotName,
    setInputSpotName,
    handleSearch,
  };
};
