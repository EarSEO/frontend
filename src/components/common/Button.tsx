import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface ButtonProps {
  text: string;
  onPress?: (text: string) => void;
  disabled: boolean;
  radius?: number | string;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  fontSize?: number | string;
}

/**
 * @param text
 * @param onPress
 * @param disabled
 * @param radius
 * @param width
 * @param height
 * @param backgroundColor
 * @param fontSize
 */

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  disabled,
  radius,
  width,
  height,
  backgroundColor,
  fontSize,
}) => {
  return (
    <StyledButton
      onPress={onPress ? () => onPress(text) : undefined}
      disabled={disabled}
      radius={radius}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      <ButtonText fontSize={fontSize}>{text}</ButtonText>
    </StyledButton>
  );
};
const StyledButton = styled.TouchableOpacity<{
  disabled: boolean;
  radius?: number | string;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
}>`
  width: ${(props) => props.width || "90%"};
  height: ${(props) => props.height || "40px"};
  background-color: ${(props) =>
    props.backgroundColor || theme.colors.background.background500};
  border-radius: ${(props) => props.radius || theme.borderRadius.s}px;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled.Text<{ fontSize?: number | string }>`
  font-size: ${(props) => props.fontSize || theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  text-align: center;
`;

export default Button;
