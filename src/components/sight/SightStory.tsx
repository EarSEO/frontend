import { useCallback, useEffect, useState } from "react";

import styled from "styled-components/native";

import { useSightMap } from "@/hooks/sight/useSightMap";

import { BriefSpotInfo, GetSpotRequest, StoryItems } from "@/types/storySpot";

import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryStore } from "@/store/story/useStoryStore";

import StoryCard from "../story/StoryCard";

const SightStory = () => {
  const { sightStoryDetails } = useSightMap();
  const { briefSpotInfo } = useStoryStore();
  const { isLoading } = useSightStore();
  const sightStoryId = briefSpotInfo?.storySpotId;

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
