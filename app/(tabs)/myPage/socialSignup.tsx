import React, { useState } from "react";

import { Alert } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import styled from "styled-components/native";

import AdditionalInfoForm from "@/components/signup/AdditionalInfoForm";

import { Gender, Provider } from "@/types/auth";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/profile/useAuthStore";

export default function SocialSignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email: string;
    provider: string;
    tempToken: string;
  }>();
  const { socialSignup } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container>
      <Header>
        <BackButtonPlaceholder />
        <HeaderTitle>추가 정보 입력</HeaderTitle>
        <HeaderSpacer />
      </Header>

      <Content>
        <EmailSection>
          <Label>이메일</Label>
          <EmailText>{params.email}</EmailText>
        </EmailSection>

        <Gap height={20} />

        <AdditionalInfoForm
          onSubmit={async (data) => {
            try {
              setIsLoading(true);

              await socialSignup({
                email: params.email,
                provider: params.provider as Provider,
                tempToken: params.tempToken,
                nickname: data.nickname,
                gender: data.gender as Gender,
                birthdate: data.birthdate,
                nationality: data.nationality,
              });

              Alert.alert("알림", "회원가입이 완료되었습니다.", [
                {
                  text: "확인",
                  onPress: () => router.replace("/myPage"),
                },
              ]);
            } catch (error: any) {
              const message =
                error.response?.data?.message || "회원가입에 실패했습니다.";
              Alert.alert("오류", message);
            } finally {
              setIsLoading(false);
            }
          }}
          buttonText="회원가입"
          isLoading={isLoading}
        />
      </Content>
    </Container>
  );
}

const Container = styled.SafeAreaView`
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
  padding-top: 30px;
`;

const EmailSection = styled.View`
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding: 15px;
`;

const Label = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 8px;
`;

const EmailText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textTertiary};
`;

const Gap = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
`;
