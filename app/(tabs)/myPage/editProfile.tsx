import { useState } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/useAuthStore";

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [nationality, setNationality] = useState("대한민국");
  const [gender, setGender] = useState("남");
  const [birthDate, setBirthDate] = useState("19xx.xx.xx");

  return (
    <Container>
      <Header>
        <BackButtonPlaceholder />
        <HeaderTitle>회원정보수정</HeaderTitle>
        <HeaderSpacer />
      </Header>

      <Content>
        <ProfileImageSection>
          <ProfileImageWrapper>
            <ProfileImage />
            <EditIconPlaceholder />
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
            placeholder="닉네임 입력"
            placeholderTextColor={theme.colors.text.textTertiary}
          />
        </InputSection>

        <InputSection>
          <Label>국적</Label>
          <SelectButton onPress={() => console.log("국적 선택")}>
            <SelectButtonText>{nationality}</SelectButtonText>
            <SelectArrow>▼</SelectArrow>
          </SelectButton>
        </InputSection>

        <InputSection>
          <Label>성별</Label>
          <DisabledInput>
            <DisabledInputText>{gender}</DisabledInputText>
          </DisabledInput>
        </InputSection>

        <InputSection>
          <Label>생년월일</Label>
          <DisabledInput>
            <DisabledInputText>{birthDate}</DisabledInputText>
          </DisabledInput>
        </InputSection>

        <PasswordChangeLink
          onPress={() => router.push("/myPage/changePassword")}
        >
          <PasswordChangeLinkText>비밀번호 변경하기</PasswordChangeLinkText>
        </PasswordChangeLink>
      </Content>

      <BottomSection>
        <Button text="저장" width="100%" onPress={() => console.log("저장")} />
        <WithdrawButton onPress={() => console.log("회원탈퇴")}>
          <WithdrawText>회원탈퇴</WithdrawText>
        </WithdrawButton>
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

const ProfileImage = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${theme.colors.grey.neutral200};
`;

const EditIconPlaceholder = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${theme.colors.grey.neutral400};
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
