import { useCallback, useEffect, useState } from "react";

import styled from "styled-components/native";

import { GetStoryRequest, StoryItem } from "@/types/storySpot";

import { getStoryInfo } from "@/api/getStoryApi";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useSightStore } from "@/store/useSightStore";

import StoryCard from "../story/StoryCard";

const SightStory = () => {
  const { selectedSight } = useSightStore();
  const { storySpotBriefInfo } = useStoryStore();
  const sightStoryId = storySpotBriefInfo?.spotId;

  const [storyDetails, setStoryDetails] = useState<StoryItem[]>();
  const [loading, setLoading] = useState(false);

  const fetchStoryDetail = useCallback(async () => {
    if (!sightStoryId || !selectedSight?.longitude || !selectedSight?.latitude)
      return;

    const req: GetStoryRequest = {
      storySpotId: sightStoryId,
      query: {
        query: {
          longitude: String(selectedSight.longitude),
          latitude: String(selectedSight.latitude),
          locale: "KO" as const,
          page: 0,
          size: 1000,
          sort: "createdAt,desc" as const,
        },
      },
    };
    try {
      const res = await getStoryInfo(req);
      setStoryDetails(res.stories);
    } catch (e) {
      setStoryDetails([]);
    } finally {
      setLoading(false);
    }

    setLoading(true);
  }, [storySpotBriefInfo, selectedSight]);

  useEffect(() => {
    fetchStoryDetail();
  });

  return (
    <Container>
      {loading ? <InfoText>이야기 불러오는 중...</InfoText> : null}

      <StoryContentContainer>
        <StoryWrapper>
          {storyDetails?.map((story, index) => (
            <StoryCard
              key={`${story.createdAt}-${index}`}
              storyId={story.storyAuthor?.storyAuthorId}
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
    </Container>
  );
};

export default SightStory;

const Container = styled.View``;

const StoryContentContainer = styled.View``;

const StoryWrapper = styled.Pressable``;

const InfoText = styled.Text`
  padding: 12px 16px;
`;
