import React, { useRef } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import StorySpotMap from "@/components/map/StorySpotMap";
import MainStoryHeader from "@/components/story/MainStoryHeader";
import { StoryAddButton } from "@/components/story/StoryAddButton";
import StorySpotHeader from "@/components/story/StorySpotHeader";

import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";

import { useStoryStore } from "@/store/story/useStoryStore";

export default function Index() {
  const Ref = useRef<any>(null);
  const animatedPosition = useSharedValue(0);

  const {
    mapRef,
    selectedMarker,
    handleMapPress,
    handleRegionChange,
    handleStoryMarkerPress,
  } = useStorySpotMap();

  const { spotMapRectangle } = useStoryStore();

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <StorySpotMap
          ref={mapRef}
          animatedPosition={animatedPosition}
          storyMarkers={spotMapRectangle}
          onRegionChangeComplete={handleRegionChange}
          onStoryMarkerPress={handleStoryMarkerPress}
          selectedStoryMarkerId={selectedMarker?.storySpotId}
          onMapPress={handleMapPress}
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
