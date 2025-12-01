import { Children } from "react";

import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  backgroundColor?: string;
  placeholderTextColor?: string;
  radius?: number;
  width?: number | string;
  height?: number | string;
  shadow?: keyof typeof theme.shadows;
  autoFocus?: boolean;
  fontSize?: number | string;
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  children?: React.ReactNode;
  editable?: boolean;
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
  backgroundColor,
  placeholder,
  radius,
  placeholderTextColor,
  width,
  height,
  shadow,
  fontSize,
  autoFocus = false,
  blurOnSubmit = true,
  onSubmitEditing,
  returnKeyType = "done",
  multiline = false,
  numberOfLines = 1,
  children,
  editable,
  ...rest
}) => {
  const shadowStyle = shadow ? theme.shadows[shadow] : {};
  return (
    <StyledInput
      value={value}
      onChangeText={onChangeText}
      backgroundColor={backgroundColor || theme.colors.white}
      placeholder={placeholder}
      radius={radius || theme.borderRadius.s}
      placeholderTextColor={
        placeholderTextColor || theme.colors.text.textPrimary
      }
      width={width || "90%"}
      height={height || "50px"}
      style={shadowStyle}
      fontSize={fontSize || theme.typography.fontSize.lg}
      autoFocus={autoFocus}
      blurOnSubmit={blurOnSubmit}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? "top" : "center"}
      editable={editable}
      {...rest}
    >
      {children}
    </StyledInput>
  );
};

const StyledInput = styled.TextInput<{
  backgroundColor: string;
  radius: number;
  width: number | string;
  height: number | string;
  placeholderTextColor: string;
  fontSize: number | string;
  autoFocus: boolean;
  blurOnSubmit?: boolean;
  multiline?: boolean;
}>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: 12px 16px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) => props.radius}px;
  font-size: ${(props) => props.fontSize}px;
  ${(props) => props.multiline && `padding-top: 12px;`}
  align-self: center;
`;

export default Input;
