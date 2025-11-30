import React, { useRef } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Map from "@/components/map/Map";
import MainStoryHeader from "@/components/story/MainStoryHeader";
import { StoryAddButton } from "@/components/story/StoryAddButton";
import StoryCard from "@/components/story/StoryCard";
import StorySpotHeader from "@/components/story/StorySpotHeader";

import { MapRef } from "@/types/map";
import { GetStoryRequest } from "@/types/storySpot";

import MapPin from "@/assets/icons/map/MapPin.svg";

import { useStoryStore } from "@/store/useStoryStore";

const testRequest: GetStoryRequest = {
  storySpotId: 1,
  query: {
    query: {
      longitude: "126.9784",
      latitude: "37.5665",
      locale: "KO",
      page: 0,
      size: 1000,
      sort: "createdAt,desc",
    },
  },
};

export default function Story() {
  const Ref = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);

  const router = useRouter();

  const { storyItems, setStoryInfo } = useStoryStore();

  const handleRoute = () => {
    setStoryInfo(testRequest);
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map ref={mapRef} animatedPosition={animatedPosition} />
        <Button>
          <MapPin onPress={handleRoute} />
        </Button>

        <CustomBottomSheet
          bottomSheetRef={Ref}
          animatedPosition={animatedPosition}
        >
          {}
          <MainStoryHeader />
          <ContentWrapper>
            {storyItems?.map((storyItem) => (
              <StoryCard
                key={storyItem.storyAuthor?.storyAuthorId}
                userNickName={storyItem.storyAuthor?.nickname}
                stroySpotName={storyItem.title}
                storyConcept={storyItem.storyConcept}
                content={storyItem.content}
                imageUrls={storyItem.imageUrls}
                likeCount={storyItem.likeCount}
                createdAt={storyItem.createdAt}
              />
            ))}
          </ContentWrapper>
        </CustomBottomSheet>
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

const Button = styled.Pressable`
  position: absolute;
`;

const ContentWrapper = styled.View`
  min-height: 200px;
`;
