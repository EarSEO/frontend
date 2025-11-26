import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  backgroundColor?: string;
  placeholderTextColor: string;
  radius?: number;
  width?: number | string;
  height?: number | string;
  shadow?: keyof typeof theme.shadows;
  fontSize?: number | string;
}

/**
 * @param value
 * @param onChangeText
 * @param backgroundColor - 배경색 (기본값: theme.colors.white)
 * @param placeholder
 * @param placeholderTextColor
 * @param radius - 테두리 둥글기 (기본값: theme.borderRadius.s)
 * @param width
 * @param height
 * @param shadow
 * @Param fontSize
 */

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  backgroundColor,
  placeholder,
  radius,
  placeholderTextColor,
  width,
  height,
  shadow,
  fontSize,
  ...rest
}) => {
  const shadowStyle = shadow ? theme.shadows[shadow] : {};
  return (
    <StyledInput
      value={value}
      onChangeText={onChangeText}
      backgroundColor={backgroundColor}
      placeholder={placeholder}
      radius={radius}
      placeholderTextColor={
        placeholderTextColor || theme.colors.text.textPrimary
      }
      width={width}
      height={height}
      style={shadowStyle}
      fontSize={fontSize}
      {...rest}
    />
  );
};

const StyledInput = styled.TextInput<{
  backgroundColor?: string;
  radius?: number;
  width?: number | string;
  height?: number | string;
  shadow?: keyof typeof theme.shadows;
  placeholderTextColor: string;
  fontSize?: number | string;
}>`
  width: ${(props) => props.width || "90%"};
  height: ${(props) => props.height || "50px"};
  padding: 12px 16px;
  background-color: ${(props) => props.backgroundColor || theme.colors.white};
  border-radius: ${(props) => props.radius || theme.borderRadius.s}px;
  font-size: ${(props) => props.fontSize || theme.typography.fontSize.md}px;
  align-self: center;
`;

export default Input;
