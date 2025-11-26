import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface ButtonProps {
  text: string;
  onPress?: (text: string) => void;
  disabled?: boolean;
  radius?: number | string;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  fontSize?: number | string;
  color?: string;
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
  disabled = false,
  radius,
  width,
  height,
  backgroundColor,
  fontSize,
  color,
}) => {
  return (
    <StyledButton
      onPress={onPress ? () => onPress(text) : undefined}
      disabled={disabled}
      radius={radius || theme.borderRadius.lg}
      width={width || "100%"}
      height={height || "48px"}
      backgroundColor={backgroundColor || theme.colors.main.primary}
    >
      <ButtonText
        fontSize={fontSize || theme.typography.fontSize.xl}
        color={color || theme.colors.text.textWhite}
      >
        {text}
      </ButtonText>
    </StyledButton>
  );
};
const StyledButton = styled.Pressable<{
  disabled: boolean;
  radius: number | string;
  width: number | string;
  height: number | string;
  backgroundColor: string;
}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.backgroundColor};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  border-radius: ${(props) => props.radius}px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text<{
  fontSize: number | string;
  color: string;
}>`
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.color};
  text-align: center;
`;

export default Button;
