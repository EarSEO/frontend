import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/story/useStoryStore";

import Divider from "./Divider";

const SummaryCard = () => {
  const { summaries } = useStoryStore();

  if (!summaries || summaries.length === 0) {
    return null;
  }
  return (
    <SummaryCardContainer>
      <SummaryDividerContainer>
        <SummaryHeader>
          <Title>이 장소의 인기있는 이야기🔥</Title>
          <SubTitle>AI가 정리해준 테마별 이야기를 확인하세요.</SubTitle>
        </SummaryHeader>
        <SummaryCardWrapper>
          {summaries?.map((summary) => (
            <SummaryCardSection key={summary.storySpotSummaryId}>
              <SummaryTitle>{summary.title}</SummaryTitle>
              <SummaryContent>{summary.summary}</SummaryContent>
            </SummaryCardSection>
          ))}
        </SummaryCardWrapper>
      </SummaryDividerContainer>
      <Divider />
    </SummaryCardContainer>
  );
};

const SummaryCardContainer = styled.View``;

const SummaryDividerContainer = styled.View`
  margin-left: 20px;
  margin-right: 20px;
  gap: 15px;
`;

const SummaryHeader = styled.View`
  gap: 5px;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.text.textPrimary};
`;

const SubTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.textSecondary};
`;

const SummaryCardWrapper = styled.View`
  gap: 5px;
`;

const SummaryCardSection = styled.View`
  border-radius: ${theme.borderRadius.md}px;
  border-width: 1px;
  padding: 16px;
  border-color: ${theme.colors.grey.neutral200};
  gap: 5px;
`;

const SummaryTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.textPrimary};
`;

const SummaryContent = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.textSecondary};
`;

export default SummaryCard;
