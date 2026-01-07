import { useEffect, useRef, useState } from "react";

import { MapRef } from "@/types/map";
import {
  GetMapStoriesRequest,
  MapSpotInfoItem,
  storySpots,
} from "@/types/storySpot";

import { useStoryStore } from "@/store/story/useStoryStore";

import { useCustomPinNavigation } from "./useCustomPinNavigation";

export const useStorySpotMap = () => {
  const {
    setMapStoryInfo,
    setStoryInfo,
    setSpotMapRectangle,
    resetStoryInfo,
    spotTitleList,
  } = useStoryStore();

  const { moveToCustomPinLocation } = useCustomPinNavigation();

  const mapRef = useRef<MapRef>(null);

  const [selectedMarker, setSelectedMarker] = useState<storySpots | undefined>(
    undefined
  );
  const [selectedStoryName, setSelectedStoryName] = useState<
    string | undefined
  >(undefined);

  //지도 선택했을 때
  const handleMapPress = () => {
    setSelectedMarker(undefined);
    resetStoryInfo();
  };

  //지도 이동 시 위치저장
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
    setSelectedMarker(story);

    if (selectedMarker?.storySpotId === story.storySpotId) {
      handleMapPress();
      return;
    }

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
    setSelectedStoryName(spotTitleList?.titles?.[0]);
    console.log("storySpot이름", spotTitleList?.titles?.[0]);

    setStoryInfo(storyRequest);
    moveToCustomPinLocation(mapRef, story.latitude, story.longitude);

    console.log(
      "마커 위치 정보 :  ",
      storyRequest.query.query.latitude,
      storyRequest.query.query.longitude
    );
    console.log("\n");
  };

  return {
    mapRef,
    selectedMarker,
    handleMapPress,
    handleRegionChange,
    handleStoryMarkerPress,
    selectedStoryName,
  };
};
