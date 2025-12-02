import { useRouter } from "expo-router";
import styled from "styled-components/native";

import { useStoryStore } from "@/store/useStoryStore";

import StoryAddButtonIcon from "../../assets/icons/story/storyAddButton.svg";

export const StoryAddButton = () => {
  const router = useRouter();
  const { storyMain } = useStoryStore();

  const handleAddStory = () => {
    {
      storyMain
        ? router.push("/story/spotLocationSelected")
        : router.push("/story/spotNameSelected");
    }
  };

  return (
    <StoryAddButtonContainer onPress={handleAddStory}>
      <StoryAddButtonIcon />
    </StoryAddButtonContainer>
  );
};

const StoryAddButtonContainer = styled.Pressable`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 999;

  width: 24px;
  height: 24px;

  align-items: center;
  justify-content: center;
`;
