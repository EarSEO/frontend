import { useEffect } from "react";

import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

import Input from "../../common/Input";

const SpotNameAdd = () => {
  const spotTitleList = useStoryStore((state) => state.selectedTitleList);
  const newSpotName = useStoryAddStore((state) => state.newSpotName);
  const setNewSpotName = useStoryAddStore((state) => state.setNewSpotName);

  const spotNames = spotTitleList?.titles;

  const spotTitles = spotNames
    ?.slice(0, 3)
    .map((spotNames) => `📍${spotNames}`)
    .join(" ");

  useEffect(() => {
    console.log(spotNames);
  });

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
        <SubTitle>선택하신 위치의 스팟이름을 지정해주세요.</SubTitle>
      </TitleWrapper>

      {spotTitles ? <SpotTitlesWrapper>{spotTitles}</SpotTitlesWrapper> : null}

      <InputWrapper>
        <Input
          value={newSpotName}
          onChangeText={handleSpotName}
          placeholder={"스팟 이름을 입력해주세요."}
          style={{ fontSize: theme.typography.fontSize.sm }}
        />
      </InputWrapper>
    </Container>
  );
};

const Container = styled.View`
  gap: 10px;
`;

const TitleWrapper = styled.View``;

const SubTitle = styled.Text`
  margin-top: 10px;
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.textPrimary};
  margin-left: 5px;
`;

const InputWrapper = styled.View`
  width: 340px;
  height: 45px;
  border-width: 1px;
  border-color: ${theme.colors.background.background500};
  border-radius: ${theme.borderRadius.md}px;
  padding: 0 16px;
  justify-content: center;
  margin-bottom: 10px;
`;

const SpotTitlesWrapper = styled.Text`
  margin-bottom: 10px;
  margin-top: 5px;
  flex: 1;
`;

export default SpotNameAdd;
