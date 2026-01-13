import { useState } from "react";

import styled from "styled-components/native";

import { useStoryStore } from "@/store/story/useStoryStore";

import Divider from "./Divider";
import StoryCard from "./StoryCard";

const MainStoryHeader = () => {
  const { storyListInMap } = useStoryStore();

  const handleSelectStoryCard = () => {
    console.log("이야기 카드 클릭");
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Title>잼애 듣고싶나요??</Title>
        <SubTitle>근처에 재밌는 얘기를 확인해보세요.</SubTitle>
      </HeaderWrapper>
      <Divider />
      <ContentWrapper onPress={handleSelectStoryCard}>
        {storyListInMap?.map((mapStory, index) => (
          <StoryCard
            key={`${mapStory.createdAt}-${index}`}
            authorId={mapStory.storyAuthor?.storyAuthorId}
            userNickName={mapStory.storyAuthor?.nickname}
            stroySpotName={mapStory.title}
            storyConcept={mapStory.storyConcept}
            content={mapStory.content}
            imageUrls={mapStory.imageUrls}
            likeCount={mapStory.likeCount}
            createdAt={mapStory.createdAt}
          />
        ))}
      </ContentWrapper>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View``;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const HeaderWrapper = styled.View`
  gap: 5px;
  margin-left: 20px;
  margin-right: 20px;
`;

const ContentWrapper = styled.Pressable``;

export default MainStoryHeader;
