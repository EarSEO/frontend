import { useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/profile/useAuthStore";

export default function ChangePassword() {
  const router = useRouter();
  const { updatePassword, isLoading } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const isNewPasswordValid = newPassword.length >= 8;
  const isPasswordMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid =
    currentPassword.length > 0 && isNewPasswordValid && isPasswordMatch;

  const handleChangePassword = async () => {
    // 에러 초기화
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setApiError("");

    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError("현재 비밀번호를 입력해주세요.");
      hasError = true;
    }

    if (!newPassword) {
      setNewPasswordError("새 비밀번호를 입력해주세요.");
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError("비밀번호는 8자 이상이어야 합니다.");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("새 비밀번호가 일치하지 않습니다.");
      hasError = true;
    }

    if (hasError) return;

    try {
      await updatePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      setApiError(message);
    }
  };

  return (
    <Container>
      <Content>
        <GuideText>새로운 비밀번호를 설정해주세요.</GuideText>

        <InputSection>
          <Label>현재 비밀번호 입력</Label>
          <StyledInput
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              setCurrentPasswordError("");
              setApiError("");
            }}
            secureTextEntry
            placeholder="현재 비밀번호"
            placeholderTextColor={theme.colors.text.textTertiary}
          />
          {currentPasswordError && (
            <ErrorText>{currentPasswordError}</ErrorText>
          )}
        </InputSection>

        <InputSection>
          <Label>비밀번호 입력</Label>
          <StyledInput
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setNewPasswordError("");
              setApiError("");
            }}
            secureTextEntry
            placeholder="새 비밀번호 (8자 이상)"
            placeholderTextColor={theme.colors.text.textTertiary}
          />
          {newPasswordError && <ErrorText>{newPasswordError}</ErrorText>}
          {newPassword.length > 0 &&
            newPassword.length < 8 &&
            !newPasswordError && (
              <ErrorText>비밀번호는 최소 8자 이상이어야 합니다.</ErrorText>
            )}
        </InputSection>

        <InputSection>
          <Label>비밀번호 확인</Label>
          <StyledInput
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError("");
              setApiError("");
            }}
            secureTextEntry
            placeholder="새 비밀번호 확인"
            placeholderTextColor={theme.colors.text.textTertiary}
          />
          {confirmPasswordError && (
            <ErrorText>{confirmPasswordError}</ErrorText>
          )}
          {confirmPassword.length > 0 &&
            !isPasswordMatch &&
            !confirmPasswordError && (
              <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
            )}
        </InputSection>

        {apiError && <ApiErrorText>{apiError}</ApiErrorText>}
      </Content>

      <BottomSection>
        <Button
          text={isLoading ? "변경 중..." : "비밀번호 변경"}
          onPress={handleChangePassword}
          disabled={isLoading || !isFormValid}
        />
      </BottomSection>
    </Container>
  );
}

const ErrorText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.alarm.error};
  margin-top: 5px;
`;

const ApiErrorText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.alarm.error};
  margin-top: 15px;
  text-align: center;
`;
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  padding-top: 20px;
`;

const GuideText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
  margin-bottom: 30px;
`;

const InputSection = styled.View`
  margin-bottom: 15px;
`;

const Label = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 8px;
`;

const StyledInput = styled.TextInput`
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding: 15px;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const BottomSection = styled.View`
  padding: 20px;
`;
