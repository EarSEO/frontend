import { Alert } from "react-native";

import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";
import BookmarkIcon from "@/assets/icons/bookmark-icon.svg";
import LastTripIcon from "@/assets/icons/last-trip-icon.svg";
import MyStoryIcon from "@/assets/icons/mystory-icon.svg";

import { useAuthStore } from "@/store/useAuthStore";

export default function MyPageIndex() {
  const router = useRouter();
  const { isLogined, user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        style: "destructive", // 빨간색으로 표시
        onPress: async () => {
          try {
            await logout();
            Alert.alert("알림", "로그아웃 되었습니다.");
          } catch (error) {
            console.error(error);
            Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  if (isLogined && user) {
    return (
      <Container>
        <LoggedInView user={user} router={router} onLogout={handleLogout} />
      </Container>
    );
  }

  return (
    <Container>
      <LoggedOutView router={router} />
    </Container>
  );
}

function LoggedOutView({ router }: { router: any }) {
  return (
    <>
      <ProfileSection>
        <ProfileImage />
        <LoginButton onPress={() => router.push("/myPage/login")}>
          <LoginButtonText>로그인 &gt;</LoginButtonText>
        </LoginButton>
      </ProfileSection>

      <Divider />

      <MenuList>
        <MenuItem onPress={() => router.push("/myPage/notice")}>
          <MenuItemText>공지사항</MenuItemText>
        </MenuItem>
        <MenuItem onPress={() => router.push("/myPage/terms")}>
          <MenuItemText>이용약관 및 정책</MenuItemText>
        </MenuItem>
      </MenuList>
    </>
  );
}

function LoggedInView({
  user,
  router,
  onLogout,
}: {
  user: any;
  router: any;
  onLogout: () => void;
}) {
  return (
    <>
      <ProfileSection>
        {user.profileImage ? (
          <ProfileImageActual source={{ uri: user.profileImage }} />
        ) : (
          <ProfileImagePlaceholder />
        )}
        <ProfileInfo>
          <NicknameRow onPress={() => router.push("/myPage/editProfile")}>
            <Nickname>{user.nickname}</Nickname>
            <ArrowText>&gt;</ArrowText>
          </NicknameRow>
          <Email>{user.email}</Email>
        </ProfileInfo>
      </ProfileSection>

      <TabArea>
        <TabButton onPress={() => console.log("내 이야기")}>
          <MyStoryIcon width={24} height={24} color={theme.colors.white} />
          <TabLabel>내 이야기</TabLabel>
        </TabButton>
        <TabButton onPress={() => console.log("북마크")}>
          <BookmarkIcon width={24} height={24} color={theme.colors.white} />
          <TabLabel>북마크</TabLabel>
        </TabButton>
        <TabButton onPress={() => console.log("지난 여행")}>
          <LastTripIcon width={24} height={24} color={theme.colors.white} />
          <TabLabel>지난 여행</TabLabel>
        </TabButton>
      </TabArea>

      <Divider />

      <MenuList>
        <MenuItem onPress={() => router.push("/myPage/editProfile")}>
          <MenuItemText>회원정보수정</MenuItemText>
        </MenuItem>
        <MenuItem onPress={() => Linking.openSettings()}>
          <MenuItemText>설정</MenuItemText>
        </MenuItem>
        <MenuItem onPress={() => router.push("/myPage/notice")}>
          <MenuItemText>공지사항</MenuItemText>
        </MenuItem>
        <MenuItem onPress={() => router.push("/myPage/terms")}>
          <MenuItemText>이용약관 및 정책</MenuItemText>
        </MenuItem>
      </MenuList>

      <LogoutButton onPress={onLogout}>
        <LogoutText>로그아웃</LogoutText>
      </LogoutButton>
    </>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProfileSection = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
`;

const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${theme.colors.grey.neutral200};
  margin-right: 15px;
`;

const LoginButton = styled.TouchableOpacity``;

const LoginButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const NicknameRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Nickname = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const ArrowText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  margin-left: 5px;
`;

const Email = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
  margin-top: 3px;
`;

const TabArea = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: 20px;
  background-color: ${theme.colors.main.primary};
  border-radius: ${theme.borderRadius.md}px;
  margin: 0 20px 20px 20px;
`;

const TabButton = styled.TouchableOpacity`
  align-items: center;
`;

const TabLabel = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.white};
  margin-top: 5px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.grey.neutral200};
  margin-horizontal: 20px;
`;

const MenuList = styled.View`
  padding-horizontal: 20px;
  padding-top: 15px;
`;

const MenuItem = styled.TouchableOpacity`
  padding-vertical: 12px;
`;

const MenuItemText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
`;

const LogoutButton = styled.TouchableOpacity`
  padding: 20px;
  align-items: center;
`;

const LogoutText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
  text-decoration-line: underline;
`;

const ProfileImagePlaceholder = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${theme.colors.grey.neutral200};
  margin-right: 15px;
`;

const ProfileImageActual = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
`;
