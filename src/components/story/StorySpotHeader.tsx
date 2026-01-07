import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/story/useStoryStore";

import Divider from "./Divider";
import StoryCard from "./StoryCard";
import SummaryCard from "./SummaryCard";

const StorySpotHeader = () => {
  const { storyItems, spotTitleList } = useStoryStore();

  const spotNames = spotTitleList?.titles;
  const mainTitle = spotNames?.[0] || "제목 없음";
  const spotTitles =
    spotNames
      ?.slice(1, 4)
      .map((spotNames) => `📍${spotNames}`)
      .join(" ") || " ";

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Title>{mainTitle}</Title>
        <SpotTitleList>{spotTitles}</SpotTitleList>
      </HeaderWrapper>

      <Divider />

      <SummaryWrapper>
        <SummaryCard />
      </SummaryWrapper>
      <DescriptionWrapper>
        <Description>
          {mainTitle}와 관련된 사람들의 이야기를 만나보세요.
        </Description>
      </DescriptionWrapper>
      <ContentWrapper>
        {storyItems?.map((storyItem, index) => (
          <StoryCard
            key={`${storyItem.createdAt}-${index}`}
            authorId={storyItem?.storyAuthor?.storyAuthorId}
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
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View``;

const HeaderWrapper = styled.View`
  gap: 5px;
  margin-left: 20px;
  margin-right: 20px;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.xxl}px;
  color: ${theme.colors.text.textPrimary};
`;

const SpotTitleList = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.text.textSecondary};
`;

const DescriptionWrapper = styled.View`
  margin-left: 20px;
  margin-right: 20px;
`;
const Description = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
`;

const SummaryWrapper = styled.View``;

const ContentWrapper = styled.View`
  min-height: 200px;
`;

export default StorySpotHeader;
