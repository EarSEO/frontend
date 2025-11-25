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
  fontSize,
  ...rest
}) => {
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
      fontSize={fontSize}
      {...rest}
    />
  );
};

const StyledInput = styled.TextInput<{
  backgroundColor?: string;
  radius?: number;
  width?: number | string;
  placeholderTextColor: string;
  fontSize?: number | string;
}>`
  width: ${(props) => props.width || "90%"};
  padding: 12px 16px;
  background-color: ${(props) => props.backgroundColor || theme.colors.white};
  border-radius: ${(props) => props.radius || theme.borderRadius.s}px;
  font-size: ${(props) => props.fontSize || theme.typography.fontSize.md}px;
  align-self: center;
`;

export default Input;
