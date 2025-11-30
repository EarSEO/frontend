import styled from "styled-components/native";

import { useStoryStore } from "@/store/useStoryStore";

import Divider from "./Divider";

const StorySpotHeader = () => {
  const { spotTitleList } = useStoryStore();

  const spotNames = spotTitleList?.titles;
  const mainTitle = spotNames?.[0] || "제목 없음";
  const spotTitles =
    spotNames
      ?.slice(1, 4)
      .map((spotNames) => `📍${spotNames}`)
      .join(" ") || " ";

  return (
    <HeaderContainer>
      <ContentWrapper>
        <Title>{mainTitle}</Title>
        <SpotTitleList>{spotTitles}</SpotTitleList>
      </ContentWrapper>
      <Divider />
      <DescriptionWrapper>
        <Description>
          {mainTitle}와 관련된 사람들의 이야기를 만나보세요.
        </Description>
      </DescriptionWrapper>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View``;

const ContentWrapper = styled.View`
  gap: 5px;
  margin-left: 20px;
  margin-right: 20px;
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const SpotTitleList = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const DescriptionWrapper = styled.View`
  margin-left: 20px;
  margin-right: 20px;
`;
const Description = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

export default StorySpotHeader;
