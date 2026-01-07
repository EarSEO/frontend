import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

import { CurationItem } from "@/types/sight";

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
      <Title>이런 곳은 어떠세요?</Title>
      <Subtitle>서울을 더 깊이 즐길 수 있는 큐레이션 추천</Subtitle>

      {curations.map((c) => (
        <Card key={c.curationId} activeOpacity={0.9}>
          <CardImage source={{ uri: c.curationImgUrl }}>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "60%",
              }}
            />
            <CardTexts>
              <CardTitle>{c.curationTitle}</CardTitle>
              <CardDescription numberOfLines={2}>
                {c.description}
              </CardDescription>
            </CardTexts>
          </CardImage>
        </Card>
      ))}
    </Container>
  );
};

export default CurationBottomSheet;

const Container = styled.ScrollView`
  padding: 20px 16px 32px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 13px;
  color: #777;
  margin-bottom: 16px;
`;

const Card = styled.TouchableOpacity`
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  height: 140px;
`;

const CardImage = styled.ImageBackground`
  width: 100%;
  height: 100%;
` as any;

const CardTexts = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
`;

const CardTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`;

const CardDescription = styled.Text`
  font-size: 12px;
  color: #eee;
`;
