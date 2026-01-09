import { useEffect, useRef, useState } from "react";

import { MapRef } from "@/types/map";
import {
  GetMapStoriesRequest,
  GetSearchTitleRequest,
  MapSpotInfoItem,
} from "@/types/storySpot";

import { useStoryStore } from "@/store/story/useStoryStore";

import { useCustomPinNavigation } from "./useCustomPinNavigation";
import { SightInfo } from "@/types/sight";
import { Keyboard } from "react-native";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { SEOUL_GEOM } from "@/constants/geometry";

export const useStorySpotMap = () => {
  const {
    setMapStoryInfo,
    setStoryInfo,
    setSpotMapRectangle,
    resetStoryInfo,
    setSpotBriefInfo,
    spotBriefInfo,
    setSearchTitle,
  } = useStoryStore();

  const { storyLocation } = useStoryAddStore();

  const { moveToCustomPinLocation, setSelectedSpot } = useCustomPinNavigation();

  const mapRef = useRef<MapRef>(null);

  const [selectedMarkerId, setSelectedMarkerId] = useState<
    number | undefined
  >();
  const [inputSpotName, setInputSpotName] = useState<string>("");

  //지도 선택했을 때(마커 선택 취소 시)
  const handleMapPress = () => {
    setSelectedMarkerId(undefined);
    resetStoryInfo();
  };

  //main 지도 이동 시 위치저장
  const handleRegionChange = (bounds: {
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

    setMapStoryInfo(mapStoriesRequest);
    setSpotMapRectangle(mapStoriesRequest);
  };

  // 스토리 마커 선택 시
  const handleStoryMarkerPress = (story: MapSpotInfoItem) => {
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
    setSpotBriefInfo({
      latitude: String(story.latitude),
      longitude: String(story.longitude),
    });

    setStoryInfo(storyRequest);
    moveToCustomPinLocation(mapRef, story.latitude, story.longitude);
    setSelectedMarkerId(spotBriefInfo?.spotId);
  };

  //sight 마커선택 시
  const handleSightMarkerPress = (sight: SightInfo) => {
    const mapLat = sight.latitude;
    const mapLng = sight.longitude;

    setSelectedSpot(Number(sight.id), sight.title);
    moveToCustomPinLocation(mapRef, mapLat, mapLng);
  };

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
        minLongitude: SEOUL_GEOM.LOGITUDE.MIN,
        minLatitude: SEOUL_GEOM.LATITUDE.MIN,
        maxLongitude: SEOUL_GEOM.LOGITUDE.MAX,
        maxLatitude: SEOUL_GEOM.LATITUDE.MAX,
        limit: "10",
      };
      await setSearchTitle(searchParams);
      setSpotBriefInfo({
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
    handleStoryMarkerPress,
    handleSightMarkerPress,
    setSearchTitle,
    inputSpotName,
    setInputSpotName,
    handleSearch,
  };
};
