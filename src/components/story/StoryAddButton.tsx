import { useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import { useAuthStore } from "@/store/useAuthStore";

import StoryAddButtonIcon from "../../assets/icons/story/storyAddButton.svg";

export const StoryAddButton = () => {
  const router = useRouter();
  const { isLogined } = useAuthStore();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false); // 중복 클릭 방지

  const handleAddStory = () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500);

    if (isLogined === true) {
      router.push("/story/spotLocationSelected");
    } else router.replace("/myPage/login");
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
