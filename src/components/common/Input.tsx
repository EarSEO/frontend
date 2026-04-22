import { Children } from "react";

import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  children?: React.ReactNode;
  editable?: boolean;
  style?: any;
}

/**
 * @param value
 * @param onChangeText
 * @param backgroundColor
 * @param placeholder
 * @param placeholderTextColor
 * @param radius
 * @param width
 * @param height
 * @param shadow
 * @Param onSubmitEditing - 키보드 완료 버튼 누르면 실행
 * @param returnKeyType - 키보드 엔더 설정
 *
 */

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = theme.colors.text.textPrimary,
  autoFocus = false,
  blurOnSubmit = true,
  onSubmitEditing,
  returnKeyType = "done",
  multiline = false,
  numberOfLines = 1,
  children,
  editable,
  style,
  ...rest
}) => {
  return (
    <StyledInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={
        placeholderTextColor || theme.colors.text.textPrimary
      }
      autoFocus={autoFocus}
      blurOnSubmit={blurOnSubmit}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? "top" : "center"}
      editable={editable}
      {...rest}
      style={style}
    >
      {children}
    </StyledInput>
  );
};

const StyledInput = styled.TextInput`
  flex: 1;
  padding: 0;
  margin: 0;
  color: ${theme.colors.text.textPrimary};
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
`;

export default Input;
