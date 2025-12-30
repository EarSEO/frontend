import { useRef, useState } from "react";

import { MapRef } from "@/types/map";
import {
  GetMapStoriesRequest,
  MapSpotInfoItem,
  storySpots,
} from "@/types/storySpot";

import { useStoryStore } from "@/store/useStoryStore";

export const useStorySpotMap = () => {
  const [selectedMarker, setSelectedMarker] = useState<
    storySpots | undefined
  >();
  const mapRef = useRef<MapRef>(null);

  const {
    setMapStoryInfo,
    setStoryInfo,
    setSpotMapRectangle,
    spotMapRectangle,
  } = useStoryStore();

  const handleMapPress = () => {
    setSelectedMarker(undefined);
  };

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

  const handleStoryMarkerPress = (sight: MapSpotInfoItem) => {
    setSelectedMarker(sight);

    const storyRequest = {
      storySpotId: sight.storySpotId,
      query: {
        query: {
          longitude: sight.longitude.toString(),
          latitude: sight.latitude.toString(),
          locale: "KO" as const,
          page: 0,
          size: 1000,
          sort: "createdAt,desc" as const,
        },
      },
    };
    setStoryInfo(storyRequest);
  };

  return {
    mapRef,
    spotMapRectangle,
    selectedMarker,
    handleMapPress,
    handleRegionChange,
    handleStoryMarkerPress,
  };
};
