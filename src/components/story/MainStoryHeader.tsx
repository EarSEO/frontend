import styled from "styled-components/native";

import { useStoryStore } from "@/store/story/useStoryStore";

import Divider from "./Divider";
import StoryCard from "./StoryCard";

const MainStoryHeader = () => {
  const { storyListInMap, toggleStoryListLike } = useStoryStore();

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Title>잼애 듣고싶나요??</Title>
        <SubTitle>근처에 재밌는 얘기를 확인해보세요.</SubTitle>
      </HeaderWrapper>
      <Divider />
      <ContentWrapper>
        {storyListInMap?.map((mapStory, index) => (
          <StoryCard
            key={`${mapStory.storyId ?? mapStory.createdAt}-${index}`}
            storyId={mapStory.storyId}
            authorId={mapStory.storyAuthor?.storyAuthorId}
            profileUrl={mapStory.storyAuthor?.profileUrl}
            userNickName={mapStory.storyAuthor?.nickname}
            stroySpotName={mapStory.title}
            storyConcept={mapStory.storyConcept}
            content={mapStory.content}
            imageUrls={mapStory.imageUrls}
            likeCount={mapStory.likeCount}
            isLiked={mapStory.isLiked}
            createdAt={mapStory.createdAt}
            onToggleLike={toggleStoryListLike}
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

const ContentWrapper = styled.View``;

export default MainStoryHeader;
