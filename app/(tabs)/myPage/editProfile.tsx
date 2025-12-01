import { useState } from "react";

import { Alert, Modal, Platform } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { Gender } from "@/types/auth";

import { theme } from "@/styles/theme";
import { NATIONALITIES } from "@/constants/nationalities";

import { useAuthStore } from "@/store/useAuthStore";

export default function EditProfile() {
  const router = useRouter();
  const { user, updateProfile, updateProfileImage, isLoading } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [nationality, setNationality] = useState(
    user?.nationality ?? "대한민국",
  );
  const [gender, setGender] = useState<"MALE" | "FEMALE">(
    user?.gender ?? "MALE",
  );
  const [birthYear, setBirthYear] = useState("2000");
  const [birthMonth, setBirthMonth] = useState("01");
  const [birthDay, setBirthDay] = useState("01");
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));
  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    user?.profileImage ?? null,
  );

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setBirthYear(date.getFullYear().toString());
      setBirthMonth((date.getMonth() + 1).toString().padStart(2, "0"));
      setBirthDay(date.getDate().toString().padStart(2, "0"));
    }
  };
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setProfileImageUri(asset.uri);

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);

      try {
        await updateProfileImage(formData);
        Alert.alert("성공", "프로필 사진이 변경되었습니다.");
      } catch (error) {
        Alert.alert("오류", "프로필 사진 업로드에 실패했습니다.");
      }
    }
  };

  const handleSave = async () => {
    if (!nickname) {
      Alert.alert("오류", "닉네임을 입력해주세요.");
      return;
    }

    if (nickname.length < 2 || nickname.length > 50) {
      Alert.alert("오류", "닉네임은 2자 이상 50자 이하여야 합니다.");
      return;
    }

    const birthdate = `${birthYear}-${birthMonth.padStart(
      2,
      "0",
    )}-${birthDay.padStart(2, "0")}`;

    try {
      await updateProfile({
        nickname,
        gender: gender === "MALE" ? Gender.MALE : Gender.FEMALE,
        birthdate,
        nationality,
      });

      Alert.alert("성공", "프로필이 수정되었습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "프로필 수정에 실패했습니다.";
      Alert.alert("오류", message);
    }
  };

  const handleOpenPasswordChange = () => {
    router.push("/myPage/changePassword");
  };

  return (
    <Container>
      <Header>
        <BackButtonPlaceholder />
        <HeaderTitle>회원정보 수정</HeaderTitle>
        <HeaderSpacer />
      </Header>

      <Content>
        <ProfileImageSection>
          <ProfileImageWrapper>
            <ProfileImageTouchable onPress={handlePickImage}>
              {profileImageUri ? (
                <ProfileImageActual
                  source={{ uri: profileImageUri ?? user!.profileImage! }}
                />
              ) : (
                <ProfileImage />
              )}
            </ProfileImageTouchable>
          </ProfileImageWrapper>
        </ProfileImageSection>

        <InputSection>
          <Label>이메일</Label>
          <DisabledInput>
            <DisabledInputText>{user?.email}</DisabledInputText>
          </DisabledInput>
        </InputSection>
        <InputSection>
          <Label>닉네임</Label>
          <StyledInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            maxLength={50}
          />
        </InputSection>

        <InputSection>
          <Label>국적</Label>
          <SelectButton onPress={() => setShowNationalityPicker(true)}>
            <SelectButtonText>{nationality}</SelectButtonText>
            <SelectArrow>▼</SelectArrow>
          </SelectButton>
        </InputSection>

        <InputSection>
          <Label>성별</Label>
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
        </InputSection>

        <InputSection>
          <Label>생년월일</Label>
          <SelectButton onPress={() => setShowDatePicker(true)}>
            <SelectButtonText>
              {birthYear}년 {birthMonth}월 {birthDay}일
            </SelectButtonText>
            <SelectArrow>▼</SelectArrow>
          </SelectButton>
        </InputSection>

        <PasswordChangeLink onPress={handleOpenPasswordChange}>
          <PasswordChangeLinkText>비밀번호 변경하기</PasswordChangeLinkText>
        </PasswordChangeLink>
      </Content>

      <BottomSection>
        <Button
          text={isLoading ? "저장 중..." : "저장"}
          onPress={handleSave}
          disabled={isLoading}
        />
        <WithdrawButton onPress={() => console.log("회원탈퇴")}>
          <WithdrawText>회원탈퇴</WithdrawText>
        </WithdrawButton>
      </BottomSection>
      <Modal
        visible={showNationalityPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNationalityPicker(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>국적 선택</ModalTitle>
              <ModalCloseButton onPress={() => setShowNationalityPicker(false)}>
                <ModalCloseText>닫기</ModalCloseText>
              </ModalCloseButton>
            </ModalHeader>
            <Picker
              selectedValue={nationality}
              onValueChange={(value) => setNationality(value)}
              style={{ color: theme.colors.text.textPrimary }}
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
            <Button
              text="완료"
              onPress={() => setShowNationalityPicker(false)}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
      {showDatePicker &&
        (Platform.OS === "ios" ? (
          <Modal visible transparent animationType="slide">
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

const Content = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

const ProfileImageSection = styled.View`
  align-items: center;
  padding-vertical: 20px;
`;

const ProfileImageWrapper = styled.View`
  position: relative;
`;

const ProfileImageTouchable = styled.TouchableOpacity``;

const ProfileImageActual = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

const ProfileImage = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${theme.colors.grey.neutral200};
`;

const InputSection = styled.View`
  margin-bottom: 20px;
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

const DisabledInput = styled.View`
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding: 15px;
`;

const DisabledInputText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textTertiary};
`;

const SelectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding: 15px;
`;

const SelectButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
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

const PasswordChangeLink = styled.TouchableOpacity`
  align-items: flex-end;
  margin-top: 10px;
`;

const PasswordChangeLinkText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
  text-decoration-line: underline;
`;

const BottomSection = styled.View`
  padding: 20px;
`;

const WithdrawButton = styled.TouchableOpacity`
  align-items: center;
  margin-top: 15px;
`;

const WithdrawText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
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
