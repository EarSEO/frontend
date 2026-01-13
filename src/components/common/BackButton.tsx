import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import BackButtonCircle from "@/assets/icons/headerButton/backButtonCircle.svg";

type buttonStyleType = "NONE" | "CIRCLE";

interface BackButtonProps {
  buttonStyle: buttonStyleType;
  disabled?: boolean;
  onPress?: () => void;
}

/**
 * @param buttonStyle
 * 사용 예시입니다.
 * buttonStyle은 1번이 icon, 2번은 동그라미
 */

const BackButton: React.FC<BackButtonProps> = ({
  disabled = false,
  buttonStyle,
  onPress,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <StyledBackButton onPress={handleBackPress} disabled={disabled}>
      {buttonStyle === "NONE" ? (
        <Ionicons name="chevron-back-outline" size={30} />
      ) : (
        <BackButtonCircle width={50} height={50} />
      )}
    </StyledBackButton>
  );
};

const StyledBackButton = styled.Pressable`
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  margin: 10px;
`;

export default BackButton;
