import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CloseButtonCircle from "@/assets/icons/headerButton/closeButtonCircle.svg";

type buttonStyleType = "NONE" | "CIRCLE";

interface CloseButtonProps {
  buttonStyle: buttonStyleType;
  disabled?: boolean;
  onPress: string;
}

/**
 * @param buttonStyle
 * @param onPress
 * 사용 예시입니다.
 * buttonStyle은 1번이 icon, 2번은 동그라미
 * onPress에 router할 screen 주소 써주세요.
 * <CloseButton buttonStyle={1} onPress="../story" />
 */

const CloseButton: React.FC<CloseButtonProps> = ({
  disabled = false,
  buttonStyle,
  onPress,
}) => {
  const router = useRouter();

  return (
    <StyledBackButton
      onPress={() => router.navigate(onPress)}
      disabled={disabled}
    >
      {buttonStyle === "NONE" ? (
        <Ionicons name="close-sharp" size={30} />
      ) : (
        <CloseButtonCircle width={50} height={50} />
      )}
    </StyledBackButton>
  );
};

const StyledBackButton = styled.Pressable`
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  margin: 10px;
`;

export default CloseButton;
