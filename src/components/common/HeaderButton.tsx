import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import BackButtonCircle from "@/assets/icons/headerButton/backButtonCircle.svg";
import CloseButtonCircle from "@/assets/icons/headerButton/closeButtonCircle.svg";

import { useHeaderButtonStore } from "@/store/common/useHeaderButtonStore";

const HeaderButton: React.FC = () => {
  const {
    buttonStyle,
    showBackButton,
    showCloseButton,
    onBackPress,
    onClosePress,
  } = useHeaderButtonStore();

  if (!showBackButton && !showCloseButton) {
    return null;
  }

  return (
    <Container>
      {showBackButton ? (
        <StyledBackButton onPress={onBackPress}>
          {buttonStyle === "NONE" ? (
            <Ionicons name="chevron-back-outline" size={30} />
          ) : (
            <BackButtonCircle width={50} height={50} />
          )}
        </StyledBackButton>
      ) : (
        <LeftSpacer />
      )}

      {showCloseButton && (
        <StyledCloseButton onPress={onClosePress}>
          {buttonStyle === "NONE" ? (
            <Ionicons name="close-sharp" size={30} />
          ) : (
            <CloseButtonCircle width={50} height={50} />
          )}
        </StyledCloseButton>
      )}
    </Container>
  );
};

const Container = styled.View`
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;

  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
`;

const LeftSpacer = styled.View`
  width: 50px;
  height: 50px;
`;

const StyledCloseButton = styled.Pressable`
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
`;

const StyledBackButton = styled.Pressable`
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
`;

export default HeaderButton;
