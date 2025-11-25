import { theme } from "@/styles/theme";
import styled from "styled-components/native";

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  backgroundColor?: string;
  placeholderTextColor: string;
  radius?: number;
  width?: number | string;
}

/**
 * @param value
 * @param onChangeText
 * @param backgroundColor - 배경색 (기본값: theme.colors.white)
 * @param placeholder
 * @param placeholderTextColor
 * @param radius - 테두리 둥글기 (기본값: theme.borderRadius.s)
 * @param width -
 */

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  backgroundColor,
  placeholder,
  radius,
  placeholderTextColor,
  width,
  ...rest
}) => {
  return (
    <InpuBar
      value={value}
      onChangeText={onChangeText}
      backgroundColor={backgroundColor}
      placeholder={placeholder}
      radius={radius}
      placeholderTextColor={
        placeholderTextColor || theme.colors.text.textPrimary
      }
      width={width}
      {...rest}
    />
  );
};

const InpuBar = styled.TextInput<{
  backgroundColor?: string;
  radius?: number;
  width?: number | string;
  placeholderTextColor: string;
}>`
  width: 90%;
  padding: 12px 16px;
  background-color: ${(props) => props.backgroundColor || theme.colors.white};
  border-radius: ${(props) => props.radius || theme.borderRadius.s}px;
  font-size: ${theme.typography.fontSize.md};
  align-self: center;
`;

export default Input;
