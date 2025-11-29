import React, { useState } from "react";

import { Alert, Modal, Platform } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

import { BaseResponse, Gender, NicknameCheckResponse } from "@/types/auth";

import { theme } from "@/styles/theme";
import API_ENDPOINTS from "@/constants/endpoints";
import NATIONALITIES from "@/constants/nationalities";

import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { signup } = useAuthStore();

  // Step 1 states
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Step 2 states
  const [nickname, setNickname] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nationality, setNationality] = useState(NATIONALITIES[0].name);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | null>(null);
  const [birthYear, setBirthYear] = useState("2000");
  const [birthMonth, setBirthMonth] = useState("01");
  const [birthDay, setBirthDay] = useState("01");

  // Modal states
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // 날짜 선택 핸들러
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setBirthYear(date.getFullYear().toString());
      setBirthMonth((date.getMonth() + 1).toString().padStart(2, "0"));
      setBirthDay(date.getDate().toString().padStart(2, "0"));
    }
  };

  // 이메일 인증코드 발송
  const handleSendVerificationCode = async () => {
    if (!email) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post(API_ENDPOINTS.AUTH.EMAIL_SEND, { email });
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

    if (!password || !confirmPassword) {
      Alert.alert("알림", "비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("알림", "비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    setStep(2);
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }

    if (nickname.length < 2 || nickname.length > 50) {
      Alert.alert("알림", "닉네임은 2자 이상 50자 이하여야 합니다.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get<BaseResponse<NicknameCheckResponse>>(
        `${API_ENDPOINTS.AUTH.NICKNAME_CHECK}?nickname=${nickname}`,
      );

      const { available, message } = response.data.data;
      setIsNicknameChecked(available);
      setNicknameMessage(message);

      if (!available) {
        Alert.alert("알림", message);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "닉네임 확인에 실패했습니다.";
      Alert.alert("오류", message);
    } finally {
      setIsLoading(false);
    }
  };

  // 닉네임 변경 시 중복확인 초기화
  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsNicknameChecked(false);
    setNicknameMessage("");
  };

  // 회원가입 완료
  const handleSignUp = async () => {
    if (!isNicknameChecked) {
      Alert.alert("알림", "닉네임 중복확인을 해주세요.");
      return;
    }

    if (!gender) {
      Alert.alert("알림", "성별을 선택해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const birthdate = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

      await signup({
        email,
        password,
        nickname,
        gender: gender as Gender,
        birthdate,
        nationality,
      });

      Alert.alert("알림", "회원가입이 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/myPage/login"),
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      Alert.alert("오류", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButtonPlaceholder />
        <HeaderTitle>회원가입</HeaderTitle>
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

          <Gap height={30} />

          <Label>비밀번호를 입력해주세요.</Label>
          <InputWrapper>
            <Input
              placeholder="비밀번호 입력"
              placeholderTextColor={theme.colors.text.textTertiary}
              value={password}
              onChangeText={setPassword}
              backgroundColor={theme.colors.background.background50}
              width="100%"
              secureTextEntry={true}
            />
          </InputWrapper>

          <InputWrapper>
            <Input
              placeholder="비밀번호 확인"
              placeholderTextColor={theme.colors.text.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              backgroundColor={theme.colors.background.background50}
              width="100%"
              secureTextEntry={true}
            />
          </InputWrapper>

          {password && confirmPassword && (
            <PasswordMatchText isMatch={password === confirmPassword}>
              {password === confirmPassword
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </PasswordMatchText>
          )}

          <ButtonContainer>
            <Button
              text="다음"
              width="100%"
              onPress={handleNextStep}
              disabled={isLoading}
            />
          </ButtonContainer>
        </StepContainer>
      )}

      {step === 2 && (
        <StepContainer>
          <Label>닉네임을 입력해주세요.</Label>
          <InputWithButton>
            <InnerInput
              placeholder="닉네임 입력"
              placeholderTextColor={theme.colors.text.textTertiary}
              value={nickname}
              onChangeText={handleNicknameChange}
            />
            <InnerButton
              onPress={handleCheckNickname}
              disabled={isLoading || isNicknameChecked}
            >
              <InnerButtonText>중복확인</InnerButtonText>
            </InnerButton>
          </InputWithButton>
          {nicknameMessage && (
            <HelperText isAvailable={isNicknameChecked}>
              {nicknameMessage}
            </HelperText>
          )}

          <Gap height={20} />

          <Label>국적을 선택해주세요.</Label>
          <SelectButton onPress={() => setShowNationalityPicker(true)}>
            <SelectButtonText selected={!!nationality}>
              {nationality}
            </SelectButtonText>
            <SelectArrow>▼</SelectArrow>
          </SelectButton>

          <Gap height={20} />

          <Label>성별을 선택해주세요.</Label>
          <GenderRow>
            <GenderButton
              selected={gender === "MALE"}
              onPress={() => setGender("MALE")}
            >
              <GenderButtonText selected={gender === "MALE"}>
                남자
              </GenderButtonText>
            </GenderButton>
            <GenderButton
              selected={gender === "FEMALE"}
              onPress={() => setGender("FEMALE")}
            >
              <GenderButtonText selected={gender === "FEMALE"}>
                여자
              </GenderButtonText>
            </GenderButton>
          </GenderRow>

          <Gap height={20} />

          <Label>생년월일을 선택해주세요.</Label>
          <SelectButton onPress={() => setShowDatePicker(true)}>
            <SelectButtonText selected={true}>
              {birthYear}년 {birthMonth}월 {birthDay}일
            </SelectButtonText>
            <SelectArrow>▼</SelectArrow>
          </SelectButton>

          <ButtonContainer>
            <Button
              text={isLoading ? "처리중..." : "회원가입"}
              width="100%"
              onPress={handleSignUp}
              disabled={isLoading}
            />
          </ButtonContainer>

          {/* 국적 선택 모달 */}
          <Modal
            visible={showNationalityPicker}
            transparent={true}
            animationType="slide"
          >
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>국적 선택</ModalTitle>
                  <ModalCloseButton
                    onPress={() => setShowNationalityPicker(false)}
                  >
                    <ModalCloseText>완료</ModalCloseText>
                  </ModalCloseButton>
                </ModalHeader>
                <Picker
                  selectedValue={nationality}
                  onValueChange={(value) => setNationality(value)}
                >
                  {NATIONALITIES.map((nation) => (
                    <Picker.Item
                      key={nation.code}
                      label={nation.name}
                      value={nation.name}
                      color={theme.colors.text.textPrimary}
                    />
                  ))}
                </Picker>
              </ModalContent>
            </ModalOverlay>
          </Modal>

          {/* 생년월일 선택 */}
          {showDatePicker &&
            (Platform.OS === "ios" ? (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
              >
                <ModalOverlay>
                  <ModalContent>
                    <ModalHeader>
                      <ModalTitle>생년월일 선택</ModalTitle>
                      <ModalCloseButton
                        onPress={() => setShowDatePicker(false)}
                      >
                        <ModalCloseText>완료</ModalCloseText>
                      </ModalCloseButton>
                    </ModalHeader>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      locale="ko-KR"
                      textColor={theme.colors.text.textPrimary}
                    />
                  </ModalContent>
                </ModalOverlay>
              </Modal>
            ) : (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            ))}
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

const HelperText = styled.Text<{ isAvailable: boolean }>`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${(props) =>
    props.isAvailable ? theme.colors.main.primary : theme.colors.alarm.error};
  margin-top: 5px;
`;

const PasswordMatchText = styled.Text<{ isMatch: boolean }>`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${(props) =>
    props.isMatch ? theme.colors.alarm.success : theme.colors.alarm.error};
  margin-top: 5px;
`;

const SelectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding-horizontal: 15px;
  height: 50px;
`;

const SelectButtonText = styled.Text<{ selected: boolean }>`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${(props) =>
    props.selected
      ? theme.colors.text.textPrimary
      : theme.colors.text.textTertiary};
`;

const SelectArrow = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text.textTertiary};
`;

const GenderRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const GenderButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.borderRadius.md}px;
  background-color: ${(props) =>
    props.selected
      ? theme.colors.main.primary
      : theme.colors.background.background50};
`;

const GenderButtonText = styled.Text<{ selected: boolean }>`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${(props) =>
    props.selected ? theme.colors.white : theme.colors.text.textPrimary};
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: ${theme.colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-bottom: 30px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const ModalTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const ModalCloseButton = styled.TouchableOpacity`
  padding: 5px 10px;
`;

const ModalCloseText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.main.primary};
`;
