import React, { useCallback, useState } from "react";

import styled from "styled-components/native";

import { CurationItem } from "@/types/sight";

import CourseCard from "../common/CourseCard";

type CurationListProps = {
  curations: CurationItem[];
  isLoading: boolean;
  onCurationSelect: (id: number) => void;
};

const CurationList: React.FC<CurationListProps> = ({
  curations,
  isLoading,
  onCurationSelect,
}) => {
  const handleCurationPress = useCallback(
    (curationId: number) => {
      onCurationSelect(curationId);
    },
    [onCurationSelect]
  );

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
              onPress={() => handleCurationPress(c.curationId)}
            />
          </Card>
        ))}
      </CuratonContainer>
    </Container>
  );
};

export default CurationList;

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
