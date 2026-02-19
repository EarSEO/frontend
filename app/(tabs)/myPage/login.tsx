import React, { useState } from "react";

import { Alert, Platform, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

import { useBookmark } from "@/hooks/sight/useBookmark";
import { useAppleLogin } from "@/hooks/useAppleLogin";

import { theme } from "@/styles/theme";
import AppleLogo from "@/assets/icons/apple-logo.svg";
import GoogleLogo from "@/assets/icons/google-logo.svg";

import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();
  const { fetchBookmark } = useBookmark();
  const {
    handleAppleLogin,
    isLoading: isAppleLoading,
    error: appleError,
  } = useAppleLogin();
  const isIOS = Platform.OS === "ios";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      fetchBookmark();
      router.back();
    } catch (error: any) {
      Alert.alert("로그인 실패", "이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <CloseButtonPlaceholder />
      </Header>

      <TitleArea>
        <Title>EarSEO</Title>
      </TitleArea>

      <InputArea>
        <Input
          placeholder="이메일 입력"
          placeholderTextColor={theme.colors.text.textTertiary}
          value={email}
          onChangeText={setEmail}
          backgroundColor={theme.colors.background.background50}
          shadow="myInput"
        />
        <Gap />
        <Input
          placeholder="비밀번호 입력"
          placeholderTextColor={theme.colors.text.textTertiary}
          value={password}
          onChangeText={setPassword}
          backgroundColor={theme.colors.background.background50}
          shadow="myInput"
          secureTextEntry={true}
        />
      </InputArea>

      <LinkContainer>
        <TouchableOpacity onPress={() => router.push("/myPage/forgotPassword")}>
          <LinkText>비밀번호 찾기</LinkText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/myPage/signup")}>
          <LinkText>회원가입</LinkText>
        </TouchableOpacity>
      </LinkContainer>

      <ButtonArea>
        <Button
          text={isLoading ? "로그인 중..." : "로그인"}
          width="90%"
          onPress={handleLogin}
          disabled={isLoading}
        />
      </ButtonArea>

      <SocialLoginArea>
        <SocialButton onPress={() => console.log("Google login")}>
          <GoogleLogo width={40} height={40} />
        </SocialButton>
        {isIOS && (
          <SocialButton onPress={handleAppleLogin} disabled={isAppleLoading}>
            <AppleLogo width={40} height={40} />
          </SocialButton>
        )}
      </SocialLoginArea>
      {appleError && <ErrorText>{appleError}</ErrorText>}
    </Container>
  );
}

const ErrorText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.alarm.error};
  margin-top: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const TitleArea = styled.View`
  align-items: center;
  margin-bottom: 50px;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.bold};
  font-size: 50px;
  color: ${theme.colors.black};
  margin-bottom: 10px;
`;

const InputArea = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 30px;
`;

const ButtonArea = styled.View`
  width: 100%;
  align-items: center;
`;

const Gap = styled.View`
  height: 15px;
`;

const LinkContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 90%;
`;

const LinkText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
  padding: 5px;
`;

const Header = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-horizontal: 15px;
`;

const CloseButtonPlaceholder = styled.View`
  width: 24px;
  height: 24px;
`;

const SocialLoginArea = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
`;

const SocialButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border-color: ${theme.colors.grey.neutral300};
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.white};
`;
