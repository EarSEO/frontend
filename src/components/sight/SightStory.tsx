import { useEffect } from "react";

import styled from "styled-components/native";

import { useSightMap } from "@/hooks/sight/useSightMap";
import { useStoryAdd } from "@/hooks/story/useStoryAdd";

import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useBottomSheetStore } from "@/store/useBottomSheetStore";

import { StoryAddButton } from "../story/StoryAddButton";
import StoryCard from "../story/StoryCard";

const SightStory = () => {
  const { sightStoryDetails } = useSightMap();
  const { briefSpotInfo } = useStoryStore();
  const { isLoading } = useSightStore();
  const sightStoryId = briefSpotInfo?.storySpotId;

  const { handleStoryAddButton } = useStoryAdd();
  const storyAddStep = useStoryAddStore((state) => state.storyAddStep);
  const { setBottomSheetAbsoluteBottom } = useBottomSheetStore();

  useEffect(() => {
    const button =
      storyAddStep == "none" ? (
        <AddButtonWrapper>
          <StoryAddButton onPressButton={handleStoryAddButton} />
        </AddButtonWrapper>
      ) : (
        <></>
      );
    setBottomSheetAbsoluteBottom(button);
    return () => {
      setBottomSheetAbsoluteBottom(undefined);
    };
  }, [storyAddStep]);

  return (
    <Container>
      {sightStoryDetails ? (
        <StoryContentContainer>
          {isLoading ? <InfoText>이야기 불러오는 중...</InfoText> : null}
          <StoryWrapper>
            {sightStoryDetails?.map((story, index) => (
              <StoryCard
                key={`${story.createdAt}-${index}`}
                storyId={sightStoryId}
                userNickName={story.storyAuthor?.nickname}
                stroySpotName={story.title}
                storyConcept={story.storyConcept}
                content={story.content}
                imageUrls={story.imageUrls}
                likeCount={story.likeCount}
                createdAt={story.createdAt}
              />
            ))}
          </StoryWrapper>
        </StoryContentContainer>
      ) : (
        <InfoText>아직 이야기가 없습니다.</InfoText>
      )}
    </Container>
  );
};

export default SightStory;

const Container = styled.View`
  margin-bottom: 80px;
`;

const StoryContentContainer = styled.View``;

const StoryWrapper = styled.Pressable``;

const InfoText = styled.Text`
  padding: 20px;
  text-align: center;
`;

const AddButtonWrapper = styled.View`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;
