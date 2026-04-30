import { Stack } from "expo-router";

export default function MyPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "마이페이지" }} />
      <Stack.Screen name="login" options={{ title: "로그인" }} />
      <Stack.Screen name="signup" options={{ title: "회원가입" }} />
      <Stack.Screen name="notice" options={{ title: "공지사항" }} />
      <Stack.Screen name="terms" options={{ title: "이용약관 및 정책" }} />
      <Stack.Screen
        name="forgotPassword"
        options={{ title: "비밀번호 찾기" }}
      />

      <Stack.Screen
        name="changePassword"
        options={{ title: "비밀번호 수정" }}
      />

      <Stack.Screen name="editProfile" options={{ title: "회원정보수정" }} />
      <Stack.Screen name="pastTrip" options={{ title: "지난 여행" }} />
      <Stack.Screen name="pastTripDetail" options={{ title: "지난 여행 상세" }} />
      <Stack.Screen name="bookmark" options={{ title: "북마크" }} />
    </Stack>
  );
}
