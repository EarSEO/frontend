// @/app/myPage/changePassword.tsx
import { useState } from "react";

import { Alert } from "react-native";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/useAuthStore";

export default function ChangePassword() {
  const router = useRouter();
  const { updatePassword, isLoading } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    // 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("오류", "새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("오류", "비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword,
      });
      Alert.alert("성공", "비밀번호가 변경되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      Alert.alert("오류", message);
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
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="현재 비밀번호"
          />
        </InputSection>

        <InputSection>
          <Label>비밀번호 입력</Label>
          <StyledInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="새 비밀번호 (8자 이상)"
          />
        </InputSection>

        <InputSection>
          <Label>비밀번호 확인</Label>
          <StyledInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="새 비밀번호 확인"
          />
        </InputSection>
      </Content>

      <BottomSection>
        <Button
          text={isLoading ? "변경 중..." : "비밀번호 변경"}
          onPress={handleChangePassword}
          disabled={isLoading}
        />
      </BottomSection>
    </Container>
  );
}

const Container = styled.View`
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
