import { useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Container>
      <Header>
        <BackButtonPlaceholder />
        <HeaderTitle>비밀번호 수정</HeaderTitle>
        <HeaderSpacer />
      </Header>

      <Content>
        <GuideText>새로운 비밀번호를 설정해주세요.</GuideText>

        <InputSection>
          <Label>현재 비밀번호 입력</Label>
          <StyledInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="현재 비밀번호 입력"
            placeholderTextColor={theme.colors.text.textTertiary}
            secureTextEntry={true}
          />
        </InputSection>

        <InputSection>
          <Label>비밀번호 입력</Label>
          <StyledInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="비밀번호 입력"
            placeholderTextColor={theme.colors.text.textTertiary}
            secureTextEntry={true}
          />
        </InputSection>

        <InputSection>
          <Label>비밀번호 확인</Label>
          <StyledInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="비밀번호 확인"
            placeholderTextColor={theme.colors.text.textTertiary}
            secureTextEntry={true}
          />
        </InputSection>
      </Content>

      <BottomSection>
        <Button
          text="변경"
          width="100%"
          onPress={() => console.log("비밀번호 변경")}
        />
      </BottomSection>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 15px;
`;

const BackButtonPlaceholder = styled.View`
  width: 24px;
  height: 24px;
`;

const HeaderTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.text.textPrimary};
`;

const HeaderSpacer = styled.View`
  width: 24px;
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
