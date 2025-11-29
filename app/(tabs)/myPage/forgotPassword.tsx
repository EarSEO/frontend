import { useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 states
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Step 2 states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Container>
      <Header>
        <BackButtonPlaceholder />
        <HeaderTitle>
          {step === 1 ? "비밀번호 찾기" : "비밀번호 변경"}
        </HeaderTitle>
        <HeaderSpacer />
      </Header>

      {step === 1 && (
        <Content>
          <GuideText>이메일을 입력해주세요.</GuideText>

          <InputSection>
            <InputWithButton>
              <InnerInput
                placeholder="이메일 입력"
                placeholderTextColor={theme.colors.text.textTertiary}
                value={email}
                onChangeText={setEmail}
              />
              <InnerButton onPress={() => console.log("인증코드 전송")}>
                <InnerButtonText>인증 코드 전송</InnerButtonText>
              </InnerButton>
            </InputWithButton>
          </InputSection>

          <InputSection>
            <Label>인증코드</Label>
            <InputWithButton>
              <InnerInput
                placeholder="인증코드 입력"
                placeholderTextColor={theme.colors.text.textTertiary}
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <Timer>02:50</Timer>
            </InputWithButton>
            <ErrorText>
              인증번호가 올바르지 않습니다. 다시 확인해주세요
            </ErrorText>
          </InputSection>

          <ResendLink onPress={() => console.log("재전송")}>
            <ResendText>메일이 도착하지 않았나요? 재전송</ResendText>
          </ResendLink>

          <BottomSection>
            <Button text="인증완료" width="100%" onPress={() => setStep(2)} />
          </BottomSection>
        </Content>
      )}

      {step === 2 && (
        <Content>
          <GuideText>신규 비밀번호를 입력해주세요.</GuideText>

          <InputSection>
            <StyledInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="비밀번호 입력"
              placeholderTextColor={theme.colors.text.textTertiary}
              secureTextEntry={true}
            />
          </InputSection>

          <InputSection>
            <InputWithIcon>
              <IconInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="비밀번호 확인"
                placeholderTextColor={theme.colors.text.textTertiary}
                secureTextEntry={true}
              />
              <CheckIconPlaceholder />
            </InputWithIcon>
          </InputSection>

          <SuccessText>비밀번호 변경 완료!</SuccessText>

          <BottomSection>
            <Button
              text="변경"
              width="100%"
              onPress={() => router.push("/myPage/login")}
            />
          </BottomSection>
        </Content>
      )}
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
  margin-bottom: 20px;
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

const InputWithButton = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding-left: 15px;
  padding-right: 5px;
  height: 50px;
`;

const InnerInput = styled.TextInput`
  flex: 1;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const InnerButton = styled.TouchableOpacity`
  background-color: ${theme.colors.main.primary};
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: ${theme.borderRadius.lg}px;
`;

const InnerButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.white};
`;

const Timer = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  padding-right: 10px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.alarm.error};
  margin-top: 8px;
`;

const ResendLink = styled.TouchableOpacity`
  align-items: center;
  margin-top: 20px;
`;

const ResendText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
  text-decoration-line: underline;
`;

const InputWithIcon = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding-right: 15px;
`;

const IconInput = styled.TextInput`
  flex: 1;
  padding: 15px;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const CheckIconPlaceholder = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${theme.colors.alarm.success};
`;

const SuccessText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.main.primary};
  text-align: center;
  margin-top: 10px;
`;

const BottomSection = styled.View`
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
`;
