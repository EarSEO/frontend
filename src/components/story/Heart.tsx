import { Octicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface HeartProps {
  storyId: number;
  likeCount: number;
  isLiked: boolean;
  onToggle: (storyId: number) => void;
  disabled?: boolean;
}

const Heart: React.FC<HeartProps> = ({ storyId, likeCount, isLiked, onToggle, disabled }) => {
  return (
    <StyledHeart onPress={() => {
      onToggle(storyId)}
      } disabled={disabled}>
      <HeartIcon>
        {isLiked ? (
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
      <HeartCount>{likeCount}</HeartCount>
    </StyledHeart>
  );
};

const StyledHeart = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const HeartIcon = styled.View``;

const HeartCount = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
`;

export default Heart;