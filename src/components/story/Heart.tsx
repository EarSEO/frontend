import { useState } from "react";

import { Octicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface HearProps {
  heartCount?: number;
}

const Heart: React.FC<HearProps> = ({ heartCount }) => {
  const [isHeart, setIsHeart] = useState(false);

  const handleIcon = () => {
    if (!isHeart) {
      setIsHeart(true);
    } else {
      setIsHeart(false);
    }
  };

  return (
    <StyledHeart onPress={handleIcon}>
      <HeartIcon onPress={handleIcon}>
        {isHeart ? (
          <Octicons
            name="heart-fill"
            size={20}
            color={theme.colors.main.primary}
          />
        ) : (
          <Octicons
            name="heart"
            size={20}
            color={theme.colors.grey.neutral400}
          />
        )}
      </HeartIcon>
      <HeartCount>{heartCount}</HeartCount>
    </StyledHeart>
  );
};

const StyledHeart = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const HeartIcon = styled.Pressable``;

const HeartCount = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.textSecondary};
`;

export default Heart;
