import React, { useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import { useRequireLogin } from "@/hooks/useRequireLogin";

import StoryAddButtonIcon from "../../assets/icons/story/storyAddButton.svg";

interface StoryAddProps {
  onPressButton: () => void;
}

export const StoryAddButton: React.FC<StoryAddProps> = ({ onPressButton }) => {
  const router = useRouter();
  const requireLogin = useRequireLogin();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false); // 중복 클릭 방지

  const handleAddStory = () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500);

    if (!requireLogin()) return;
    else {
      onPressButton();
    }
  };

  return (
    <StoryAddButtonContainer onPress={handleAddStory}>
      <StoryAddButtonIcon />
    </StoryAddButtonContainer>
  );
};

const StoryAddButtonContainer = styled.Pressable`
  /* position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 999;

  width: 24px;
  height: 24px;

  align-items: center;
  justify-content: center; */
`;
