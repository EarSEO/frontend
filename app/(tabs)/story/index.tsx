import React, { useEffect, useRef } from "react";

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
import { GetMapStoriesRequest, GetStoryRequest } from "@/types/storySpot";

import { useStoryStore } from "@/store/useStoryStore";

const dummyGetMapStoriesRequest: GetMapStoriesRequest = {
  minLongitude: "126",
  minLatitude: "36",
  maxLongitude: "128",
  maxLatitude: "39",
  page: 0,
  size: 10,
  sort: "createdAt,desc",
};

export default function Index() {
  const Ref = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);
  const { setMapStoryInfo, storyMain } = useStoryStore();

  useEffect(() => {
    setMapStoryInfo(dummyGetMapStoriesRequest);
  }, []);

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map ref={mapRef} animatedPosition={animatedPosition} />

        <CustomBottomSheet
          bottomSheetRef={Ref}
          animatedPosition={animatedPosition}
        >
          {storyMain ? <MainStoryHeader /> : <StorySpotHeader />}
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
