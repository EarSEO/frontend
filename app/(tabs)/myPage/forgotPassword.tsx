import { useState } from "react";

import { Alert } from "react-native";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";
import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 states
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 2 states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 이메일 인증코드 발송
  const handleSendVerificationCode = async () => {
    if (!email) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post(API_ENDPOINTS.AUTH.EMAIL_PASSWORD_SEND, { email });
      setIsEmailSent(true);
      Alert.alert("알림", "인증코드가 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "인증코드 발송에 실패했습니다.";
      Alert.alert("오류", message);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert("알림", "인증코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post(API_ENDPOINTS.AUTH.EMAIL_VERIFY, {
        email,
        code: verificationCode,
      });
      setIsEmailVerified(true);
      Alert.alert("알림", "이메일 인증이 완료되었습니다.");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "인증코드가 올바르지 않습니다.";
      Alert.alert("오류", message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 -> Step 2 이동
  const handleNextStep = () => {
    if (!isEmailVerified) {
      Alert.alert("알림", "이메일 인증을 완료해주세요.");
      return;
    }
    setStep(2);
  };

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("알림", "비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("알림", "비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
        newPassword,
      });
      Alert.alert("알림", "비밀번호가 변경되었습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/myPage/login"),
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      Alert.alert("오류", message);
    } finally {
      setIsLoading(false);
    }
  };

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
        <StepContainer>
          <Label>이메일을 입력해주세요.</Label>
          <InputWithButton>
            <InnerInput
              placeholder="이메일 입력"
              placeholderTextColor={theme.colors.text.textTertiary}
              value={email}
              onChangeText={setEmail}
              editable={!isEmailVerified}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InnerButton
              onPress={handleSendVerificationCode}
              disabled={isLoading || isEmailVerified}
            >
              <InnerButtonText>
                {isEmailSent ? "재전송" : "인증 코드 전송"}
              </InnerButtonText>
            </InnerButton>
          </InputWithButton>

          <Gap height={10} />

          <InputWithButton>
            <InnerInput
              placeholder="인증코드 입력"
              placeholderTextColor={theme.colors.text.textTertiary}
              value={verificationCode}
              onChangeText={setVerificationCode}
              editable={isEmailSent && !isEmailVerified}
              keyboardType="number-pad"
            />
            {isEmailVerified ? (
              <VerifiedBadge>
                <VerifiedText>✓</VerifiedText>
              </VerifiedBadge>
            ) : (
              <InnerButton
                onPress={handleVerifyCode}
                disabled={isLoading || !isEmailSent}
              >
                <InnerButtonText>확인</InnerButtonText>
              </InnerButton>
            )}
          </InputWithButton>

          <ButtonContainer>
            <Button
              text="다음"
              width="100%"
              onPress={handleNextStep}
              disabled={isLoading || !isEmailVerified}
            />
          </ButtonContainer>
        </StepContainer>
      )}

      {step === 2 && (
        <StepContainer>
          <Label>새 비밀번호를 입력해주세요.</Label>
          <InputWrapper>
            <StyledInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="비밀번호 입력 (8자 이상)"
              placeholderTextColor={theme.colors.text.textTertiary}
              secureTextEntry={true}
            />
          </InputWrapper>

          <InputWrapper>
            <StyledInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="비밀번호 확인"
              placeholderTextColor={theme.colors.text.textTertiary}
              secureTextEntry={true}
            />
          </InputWrapper>

          {newPassword && confirmPassword && (
            <PasswordMatchText isMatch={newPassword === confirmPassword}>
              {newPassword === confirmPassword
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </PasswordMatchText>
          )}

          <ButtonContainer>
            <Button
              text="변경"
              width="100%"
              onPress={handleChangePassword}
              disabled={
                isLoading ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
            />
          </ButtonContainer>
        </StepContainer>
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

const StepContainer = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Label = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 10px;
`;

const InputWrapper = styled.View`
  margin-bottom: 10px;
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

const InnerInput = styled.TextInput<{ editable?: boolean }>`
  flex: 1;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${(props) =>
    props.editable === false
      ? theme.colors.text.textTertiary
      : theme.colors.text.textPrimary};
`;

const InnerButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) =>
    props.disabled ? theme.colors.grey.neutral300 : theme.colors.main.primary};
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: ${theme.borderRadius.lg}px;
`;

const InnerButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.white};
`;

const StyledInput = styled.TextInput`
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding: 15px;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const VerifiedBadge = styled.View`
  background-color: ${theme.colors.alarm.success};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

const VerifiedText = styled.Text`
  color: ${theme.colors.white};
  font-size: 16px;
`;

const Gap = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
`;

const PasswordMatchText = styled.Text<{ isMatch: boolean }>`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${(props) =>
    props.isMatch ? theme.colors.alarm.success : theme.colors.alarm.error};
  margin-top: 5px;
`;
