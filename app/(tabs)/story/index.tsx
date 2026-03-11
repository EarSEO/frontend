import React, { useEffect, useRef } from "react";

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
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);

  const {
    mapRef,
    selectedMarker,
    handleMapPress,
    handleRegionChange,
    handleStoryMarkerPress,
  } = useStorySpotMap();

  const { spotLocationInMap } = useStoryStore();

  const navigateStorySpotId = useStoryStore((state) => state.navigateStorySpotId);

  useEffect(() => {
    if (!navigateStorySpotId) return;

    const targetSpot = spotLocationInMap?.find(
      (spot) => spot.storySpotId === navigateStorySpotId
    );

    if (targetSpot) {
      handleStoryMarkerPress(targetSpot);
    }

    useStoryStore.getState().clearNavigateStorySpotId();
  }, [navigateStorySpotId, spotLocationInMap]);

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <StorySpotMap
          ref={mapRef}
          animatedPosition={animatedPosition}
          storyMarkers={spotLocationInMap}
          onRegionChangeComplete={handleRegionChange}
          onStoryMarkerPress={handleStoryMarkerPress}
          selectedStoryMarkerId={selectedMarker}
          onMapPress={handleMapPress}
        />

        <CustomBottomSheet
          bottomSheetRef={bottomSheetRef}
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
