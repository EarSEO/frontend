import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { GetSpotBriefInfoRequest } from "@/types/storySpot";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/useStoryStore";

import BackButton from "../common/BackButton";
import Button from "../common/Button";
import Input from "../common/Input";

interface SpotNameAddProps {
  onSpotNameChange: (name: string) => void;
}

const SpotNameAdd = ({ onSpotNameChange }: SpotNameAddProps) => {
  const [newSpotname, setNewSpotName] = useState<string>();
  const { setSpotBriefInfo, spotBriefInfo } = useStoryStore();
  const spotNames = spotBriefInfo?.titles;

  const spotTitles =
    spotNames
      ?.slice(0, 3)
      .map((spotNames) => `📍${spotNames}`)
      .join(" ") || " ";

  const handleSpotNamePass = (text: string) => {
    setNewSpotName(text);
    onSpotNameChange(text);
  };

  const handleSpotSearch = () => {
    console.log("검색:", newSpotname);
  };

  return (
    <Container>
      <TitleWrapper>
        <Title>스팟 이름 지정</Title>
        <SubTitle>선택하신 위치의 스팟이름을 지정해주세요.</SubTitle>
      </TitleWrapper>

      <InputWrapper>
        <StyledInput
          value={newSpotname}
          onChangeText={handleSpotNamePass}
          radius={10}
          placeholder="스팟이름을 입력해주세요."
          backgroundColor={theme.colors.grey.neutral100}
          fontSize={theme.typography.fontSize.sm}
        />
        <SpotCheckButton onPress={handleSpotSearch}>
          <Ionicons
            name="search"
            size={18}
            color={theme.colors.grey.neutral600}
          />
        </SpotCheckButton>
      </InputWrapper>

      <SpotTitlesWrapper>{spotTitles}</SpotTitlesWrapper>
    </Container>
  );
};

const Container = styled.View`
  gap: 20px;
  margin: 10px;
`;

const TitleWrapper = styled.View`
  padding-left: 20px;
  padding-right: 20px;

  gap: 5px;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};

  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.text.textPrimary};
`;
const SubTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
`;

const InputWrapper = styled.View`
  position: relative;
`;

const StyledInput = styled(Input)`
  padding-right: 45px;
`;

const SpotCheckButton = styled.Pressable`
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  padding: 8px;
  justify-content: center;
  align-items: center;
`;

const SpotTitlesWrapper = styled.Text`
  margin: 10px;
  padding-left: 20px;
  padding-right: 20px;
`;

export default SpotNameAdd;
