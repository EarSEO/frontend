import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/story/useStoryStore";

import Divider from "./Divider";
import StoryCard from "./StoryCard";
import SummaryCard from "./SummaryCard";

const StorySpotHeader = () => {
  const briefSpotInfo = useStoryStore((state) => state.briefSpotInfo);
  const storyItems = useStoryStore((state) => state.stories);
  const spotTitleList = useStoryStore((state) => state.spotTitleList);

  //spot names
  const titles = spotTitleList?.titles ?? [];

  const mainTitle = titles[titles.length - 1] || "제목 없음";
  const spotTitles =
    titles
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
        {storyItems?.map((story, index) => (
          <StoryCard
            key={`${story}-${index}`}
            storyId={briefSpotInfo?.storySpotId}
            userNickName={story.storyAuthor?.nickname}
            stroySpotName={story.title}
            storyConcept={story.storyConcept}
            content={story.content}
            imageUrls={story.imageUrls}
            likeCount={story.likeCount}
            createdAt={story.createdAt}
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
