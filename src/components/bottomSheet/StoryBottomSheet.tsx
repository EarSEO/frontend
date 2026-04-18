import { useEffect } from "react";

import styled from "styled-components/native";

import { useStoryAdd } from "@/hooks/story/useStoryAdd";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useBaseMapStore } from "@/store/useBaseMapStore";
import { useBottomSheetStore } from "@/store/useBottomSheetStore";
import { useMapHeaderStore } from "@/store/useMapHeaderStore";

import Button from "../common/Button";
import MainStoryHeader from "../story/MainStoryHeader";
import { StoryAddButton } from "../story/StoryAddButton";
import StorySpotHeader from "../story/StorySpotHeader";
import SpotLocationAdd from "../storyAdd/SpotLocationAdd";
import SpotNameAdd from "../storyAdd/SpotNameAdd";
import SpotStoryAdd from "../storyAdd/SpotStoryAdd";

const StoryBottomSheet = () => {
  const briefSpotInfo = useStoryStore((state) => state.briefSpotInfo);
  const selectedSpotSpotId = briefSpotInfo?.storySpotId;

  const { handleStoryAddButton, fetchAddSpotInfo, handleNewSpotInfo } =
    useStoryAdd();
  const storyAddStep = useStoryAddStore((state) => state.storyAddStep);

  const { setBottomSheetAbsoluteBottom } = useBottomSheetStore();

  const { setCenterPinVisibility } = useBaseMapStore();
  const { setMapHeaderContent } = useMapHeaderStore();

  useEffect(() => {
    let button;
    switch (storyAddStep) {
      case "none":
        button = (
          <AddButtonWrapper>
            <StoryAddButton onPressButton={handleStoryAddButton} />
          </AddButtonWrapper>
        );
        break;
      case "location":
        setCenterPinVisibility(true);
        setMapHeaderContent(undefined);
        button = (
          <ButtonWrapper>
            <Button
              text="이 위치에서 이야기 등록하기"
              onPress={fetchAddSpotInfo}
              width="90%"
              fontSize={theme.typography.fontSize.sm}
            />
          </ButtonWrapper>
        );
        break;
      case "name":
        setMapHeaderContent(undefined);
        button = (
          <ButtonWrapper>
            <Button
              text="Next"
              onPress={handleNewSpotInfo}
              width="90%"
              fontSize={theme.typography.fontSize.sm}
            />
          </ButtonWrapper>
        );
        break;
    }
    setBottomSheetAbsoluteBottom(button);
    return () => {
      setBottomSheetAbsoluteBottom(undefined);
    };
  }, [
    storyAddStep,
    handleStoryAddButton,
    fetchAddSpotInfo,
    handleNewSpotInfo,
    setBottomSheetAbsoluteBottom,
  ]);

  return (
    <Container>
      {storyAddStep == "none" && (
        <StoryContainer>
          {selectedSpotSpotId ? <StorySpotHeader /> : <MainStoryHeader />}
        </StoryContainer>
      )}
      {storyAddStep === "location" && <SpotLocationAdd />}
      {storyAddStep === "name" && <SpotNameAdd />}
      {storyAddStep === "storyAdd" && <SpotStoryAdd />}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const StoryContainer = styled.View``;

const AddButtonWrapper = styled.View`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

const ButtonWrapper = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  align-items: center;
  justify-content: center;
`;

export default StoryBottomSheet;
