import { useEffect, useState } from "react";

import styled from "styled-components/native";

import { useStoryAdd } from "@/hooks/story/useStoryAdd";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

import Input from "../common/Input";

const SpotNameAdd = () => {
  const spotTitleList = useStoryStore((state) => state.spotTitleList);
  const newSpotName = useStoryAddStore((state) => state.newSpotName);
  const setNewSpotName = useStoryAddStore((state) => state.setNewSpotName);

  const spotNames = spotTitleList?.titles;

  const spotTitles =
    spotNames
      ?.slice(0, 3)
      .map((spotNames) => `📍${spotNames}`)
      .join(" ") || " ";

  // useEffect(() => {
  //   if (selectedSpotTitle) {
  //     setInputSpotName(selectedSpotTitle);
  //     setNewSpotName(selectedSpotTitle);
  //   }
  // }, [setInputSpotName]);

  const handleSpotName = (text: string) => {
    setNewSpotName(text);
  };

  return (
    <Container>
      <TitleWrapper>
        <Title>스팟 이름 지정</Title>
        <SubTitle>선택하신 위치의 스팟이름을 지정해주세요.</SubTitle>
      </TitleWrapper>

      <InputWrapper>
        <StyledInput
          value={newSpotName}
          onChangeText={handleSpotName}
          radius={10}
          placeholder={"스팟 이름을 입력해주세요."}
        />
      </InputWrapper>

      <SpotTitlesWrapper>{spotTitles}</SpotTitlesWrapper>
    </Container>
  );
};

const Container = styled.View`
  gap: 20px;
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
  font-family: ${theme.typography.fontFamily.regular}px;
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
`;

const InputWrapper = styled.View`
  position: relative;
`;

const StyledInput = styled(Input)`
  padding-right: 45px;
  border-radius: 10px;
  background-color: ${theme.colors.grey.neutral100};
  font-size: ${theme.typography.fontSize.sm};
`;

const SpotTitlesWrapper = styled.Text`
  margin: 10px;
  padding-left: 20px;
  padding-right: 20px;
`;

export default SpotNameAdd;
