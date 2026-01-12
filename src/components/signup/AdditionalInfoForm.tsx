import React, { useState } from "react";

import { Modal, Platform } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { BaseResponse, NicknameCheckResponse } from "@/types/auth";

import { theme } from "@/styles/theme";
import API_ENDPOINTS from "@/constants/endpoints";
import { NATIONALITIES } from "@/constants/nationalities";

import api from "@/api/axios";

interface AdditionalInfoFormProps {
  onSubmit: (data: {
    nickname: string;
    nationality: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
  }) => Promise<void>;
  buttonText: string;
  isLoading: boolean;
}

export default function AdditionalInfoForm({
  onSubmit,
  buttonText,
  isLoading,
}: AdditionalInfoFormProps) {
  const [nickname, setNickname] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [isBirthdateSelected, setIsBirthdateSelected] = useState(false);

  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));

  const [isChecking, setIsChecking] = useState(false);

  const [nicknameError, setNicknameError] = useState("");
  const [nationalityError, setNationalityError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setBirthYear(date.getFullYear().toString());
      setBirthMonth((date.getMonth() + 1).toString().padStart(2, "0"));
      setBirthDay(date.getDate().toString().padStart(2, "0"));
      setIsBirthdateSelected(true);
      setBirthdateError("");
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    if (nickname.length < 2 || nickname.length > 50) {
      setNicknameError("닉네임은 2자 이상 50자 이하여야 합니다.");
      return;
    }

    try {
      setIsChecking(true);
      setNicknameError("");
      const response = await api.get<BaseResponse<NicknameCheckResponse>>(
        `${API_ENDPOINTS.AUTH.NICKNAME_CHECK}?nickname=${nickname}`,
      );

      const { available, message } = response.data.data;
      setIsNicknameChecked(available);
      setNicknameMessage(message);

      if (!available) {
        setNicknameError(message);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "닉네임 확인에 실패했습니다.";
      setNicknameError(message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsNicknameChecked(false);
    setNicknameMessage("");
    setNicknameError("");
  };

  const handleSubmit = async () => {
    let hasError = false;
    if (!isNicknameChecked) {
      setNicknameError("닉네임 중복확인을 해주세요.");
      hasError = true;
    }

    if (!nationality) {
      setNationalityError("국적을 선택해주세요.");
      hasError = true;
    }

    if (!gender) {
      setGenderError("성별을 선택해주세요.");
      hasError = true;
    }

    if (!isBirthdateSelected) {
      setBirthdateError("생년월일을 선택해주세요.");
      hasError = true;
    }

    if (hasError) return;

    const birthdate = `${birthYear}-${birthMonth}-${birthDay}`;

    await onSubmit({
      nickname,
      nationality,
      gender: gender!,
      birthdate,
    });
  };

  return (
    <Container>
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
          disabled={isChecking || isNicknameChecked}
        >
          <InnerButtonText>중복확인</InnerButtonText>
        </InnerButton>
      </InputWithButton>
      {nicknameError ? (
        <ErrorText>{nicknameError}</ErrorText>
      ) : nicknameMessage ? (
        <HelperText isAvailable={isNicknameChecked}>
          {nicknameMessage}
        </HelperText>
      ) : null}

      <Gap height={20} />

      <Label>국적을 선택해주세요.</Label>
      <SelectButton onPress={() => setShowNationalityPicker(true)}>
        <SelectButtonText selected={!!nationality}>
          {nationality || "국적을 선택하세요"}
        </SelectButtonText>
        <SelectArrow>▼</SelectArrow>
      </SelectButton>
      {nationalityError && <ErrorText>{nationalityError}</ErrorText>}

      <Gap height={20} />

      <Label>성별을 선택해주세요.</Label>
      <GenderRow>
        <GenderButton
          selected={gender === "MALE"}
          onPress={() => { setGender("MALE"); 
            setGenderError("");
          }} 
        >
          <GenderButtonText selected={gender === "MALE"}>남자</GenderButtonText>
        </GenderButton>
        <GenderButton
          selected={gender === "FEMALE"}
          onPress={() => {
            setGender("FEMALE");
            setGenderError("");
          }}
        >
          <GenderButtonText selected={gender === "FEMALE"}>
            여자
          </GenderButtonText>
        </GenderButton>
      </GenderRow>
      {genderError && <ErrorText>{genderError}</ErrorText>}

      <Gap height={20} />

      <Label>생년월일을 선택해주세요.</Label>
      <SelectButton onPress={() => setShowDatePicker(true)}>
        <SelectButtonText selected={isBirthdateSelected}>
          {isBirthdateSelected
            ? `${birthYear}년 ${birthMonth}월 ${birthDay}일`
            : "생년월일을 선택하세요"}
        </SelectButtonText>
        <SelectArrow>▼</SelectArrow>
      </SelectButton>
      {birthdateError && <ErrorText>{birthdateError}</ErrorText>}

      <ButtonContainer>
        <Button
          text={isLoading ? "처리중..." : buttonText}
          width="100%"
          onPress={handleSubmit}
          disabled={isLoading}
        />
      </ButtonContainer>

      <Modal
        visible={showNationalityPicker}
        transparent={true}
        animationType="slide"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>국적 선택</ModalTitle>
              <ModalCloseButton onPress={() => setShowNationalityPicker(false)}>
                <ModalCloseText>완료</ModalCloseText>
              </ModalCloseButton>
            </ModalHeader>
            <Picker
              selectedValue={nationality}
              onValueChange={(value) => {
                    if (value !== "") {
                      setNationality(value);
                      setNationalityError("");
                    }
                  }}
              style={{ color: theme.colors.text.textPrimary }}
            >
              <Picker.Item
                label="국적을 선택하세요"
                value=""
                color={theme.colors.text.textTertiary}
              />
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
                  <ModalCloseButton onPress={() => setShowDatePicker(false)}>
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
    </Container>
  );
}

const ErrorText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.alarm.error};
  margin-top: 5px;
`;

const Container = styled.View`
  flex: 1;
`;

const Label = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
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

const InnerInput = styled.TextInput`
  flex: 1;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
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

const Gap = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
`;

const HelperText = styled.Text<{ isAvailable: boolean }>`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${(props) =>
    props.isAvailable ? theme.colors.main.primary : theme.colors.alarm.error};
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

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
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
