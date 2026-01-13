import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

import { CurationItem } from "@/types/sight";

import { theme } from "@/styles/theme";

import CourseCard from "../common/CourseCard";

type CurationBottomSheetProps = {
  curations: CurationItem[];
  isLoading: boolean;
};

const CurationBottomSheet: React.FC<CurationBottomSheetProps> = ({
  curations,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Container>
        <Title>이런 곳은 어떠세요?</Title>
        <Subtitle>서울을 더 깊이 즐길 수 있는 큐레이션 추천</Subtitle>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <Title>이런 곳은 어떠세요?</Title>
        <Subtitle>서울을 더 깊이 즐길 수 있는 큐레이션 추천</Subtitle>
      </HeaderContainer>

      <CuratonContainer>
        {curations.map((c) => (
          <Card key={c.curationId}>
            <CourseCard
              image={c.curationImgUrl}
              courseTitle={c.curationTitle}
              courseSubTitle={c.description}
            />
          </Card>
        ))}
      </CuratonContainer>
    </Container>
  );
};

export default CurationBottomSheet;

const Container = styled.View`
  gap: 10px;
`;

const HeaderContainer = styled.View`
  gap: 5px;
  margin: 0 20px;
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const CuratonContainer = styled.ScrollView``;

const Card = styled.Pressable`
  align-items: center;
`;
