import { useEffect, useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

import resetPasswordApi, { ApiError } from "@/api/auth/resetPasswordApi";
import sendPasswordCodeApi from "@/api/auth/sendPasswordCodeApi";
import verifyEmailCodeApi from "@/api/auth/verifyEmailCodeApi";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 에러 메시지 상태
  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 비밀번호 유효성 상태
  const isPasswordLengthValid = newPassword.length >= 8;
  const isPasswordMatch = newPassword === confirmPassword;

  // 버튼 비활성화 조건
  const isStep2Valid =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    isPasswordLengthValid &&
    isPasswordMatch;

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 시간 포맷 함수
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // 이메일 인증코드 발송
  const handleSendVerificationCode = async () => {
    setEmailError("");

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordCodeApi(email);
      setIsEmailSent(true);
      setTimeLeft(300);
    } catch (error) {
      setEmailError("인증코드 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증코드 확인
  const handleVerifyCode = async () => {
    setVerificationError("");

    if (!verificationCode) {
      setVerificationError("인증코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await verifyEmailCodeApi(email, verificationCode);
      setStep(2);
    } catch (error) {
      setVerificationError("인증코드가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    setPasswordError("");

    try {
      setIsLoading(true);
      await resetPasswordApi(email, newPassword);
      router.replace("/myPage/login");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "MEM014") {
          setPasswordError(
            "기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다."
          );
        } else {
          setPasswordError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        setPasswordError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
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
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              editable={!isEmailSent}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InnerButton
              onPress={handleSendVerificationCode}
              disabled={isLoading || isEmailSent}
            >
              <InnerButtonText>인증 코드 전송</InnerButtonText>
            </InnerButton>
          </InputWithButton>
          {emailError && <ErrorText>{emailError}</ErrorText>}

          {isEmailSent && (
            <>
              <Gap height={10} />
              <SuccessText>
                인증코드가 발송되었습니다. 이메일을 확인해주세요.
              </SuccessText>
              {timeLeft > 0 ? (
                <TimerText>남은 시간: {formatTime(timeLeft)}</TimerText>
              ) : (
                <ErrorText>
                  인증코드가 만료되었습니다. 다시 요청해주세요.
                </ErrorText>
              )}
              <Gap height={10} />

              <InputWithButton>
                <InnerInput
                  placeholder="인증코드 입력"
                  placeholderTextColor={theme.colors.text.textTertiary}
                  value={verificationCode}
                  onChangeText={(text) => {
                    setVerificationCode(text);
                    setVerificationError("");
                  }}
                  keyboardType="number-pad"
                  editable={timeLeft > 0}
                />
                <InnerButton
                  onPress={handleVerifyCode}
                  disabled={isLoading || !verificationCode || timeLeft <= 0}
                >
                  <InnerButtonText>확인</InnerButtonText>
                </InnerButton>
              </InputWithButton>
              {timeLeft <= 0 && (
                <ResendButton
                  onPress={handleSendVerificationCode}
                  disabled={isLoading}
                >
                  <ResendButtonText>인증코드 재전송</ResendButtonText>
                </ResendButton>
              )}
              {verificationError && <ErrorText>{verificationError}</ErrorText>}
            </>
          )}
        </StepContainer>
      )}

      {step === 2 && (
        <StepContainer>
          <Label>새 비밀번호를 입력해주세요.</Label>
          <InputWrapper>
            <StyledInput
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError("");
              }}
              placeholder="비밀번호 입력 (8자 이상)"
              placeholderTextColor={theme.colors.text.textTertiary}
              secureTextEntry={true}
            />
          </InputWrapper>
          {newPassword.length > 0 &&
            newPassword.length < 8 &&
            !passwordError && (
              <ErrorText>비밀번호는 최소 8자 이상이어야 합니다.</ErrorText>
            )}

          <InputWrapper>
            <StyledInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError("");
              }}
              placeholder="비밀번호 확인"
              placeholderTextColor={theme.colors.text.textTertiary}
              secureTextEntry={true}
            />
          </InputWrapper>
          {confirmPassword.length > 0 && !isPasswordMatch && !passwordError && (
            <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
          )}

          {passwordError && <ErrorText>{passwordError}</ErrorText>}

          <ButtonContainer>
            <Button
              text="변경"
              width="100%"
              onPress={handleChangePassword}
              disabled={isLoading || !isStep2Valid}
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
  margin-bottom: 5px;
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

const Gap = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
`;

const ValidationText = styled.Text<{ isValid: boolean }>`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${(props) =>
    props.isValid ? theme.colors.alarm.success : theme.colors.alarm.error};
  margin-top: 2px;
  margin-bottom: 8px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.alarm.error};
  margin-top: 5px;
`;

const SuccessText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.alarm.success};
`;

const TimerText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.main.primary};
  margin-top: 5px;
`;

const ResendButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  margin-top: 10px;
  padding: 10px;
  align-items: center;
`;

const ResendButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.main.primary};
  text-decoration-line: underline;
`;
