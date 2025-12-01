import React, { useEffect, useRef, useState } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Map from "@/components/map/Map";
import MainStoryHeader from "@/components/story/MainStoryHeader";
import { StoryAddButton } from "@/components/story/StoryAddButton";
import StorySpotHeader from "@/components/story/StorySpotHeader";

import { MapRef } from "@/types/map";
import {
  GetMapStoriesRequest,
  GetSearchTitleRequest,
  GetStoryRequest,
} from "@/types/storySpot";

import { useStoryStore } from "@/store/useStoryStore";
import { SightInfo } from "@/types/sight";
import { useSightMap } from "@/hooks/useSightMap";

export default function Index() {
  const Ref = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);
  const { setMapStoryInfo, storyMain, setStoryInfo } = useStoryStore();
  const [selectedMarker, setSelectedMarker] = useState<SightInfo | null>(null);
  const { sights } = useSightMap();

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
  };

  const handleMarkerPress = (sight: SightInfo) => {
    setSelectedMarker(sight);

    const storyRequest = {
      storySpotId: parseInt(sight.id),
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

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map
          ref={mapRef}
          animatedPosition={animatedPosition}
          onRegionChangeComplete={handleRegionChange}
          onMarkerPress={handleMarkerPress}
          selectedMarkerId={selectedMarker?.id}
        />

        <CustomBottomSheet
          bottomSheetRef={Ref}
          animatedPosition={animatedPosition}
        >
          {selectedMarker ? <StorySpotHeader /> : <MainStoryHeader />}
        </CustomBottomSheet>
        <StoryAddButton />
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
