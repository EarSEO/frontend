import { Alert } from "react-native";

import { useRouter } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";

export const useRequireLogin = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const requireLogin = () => {
    if (!user) {
      Alert.alert("로그인이 필요합니다.", "로그인하시겠습니까?", [
        { text: "아니오", style: "cancel" },
        { text: "예", onPress: () => router.push("/myPage/login") },
      ]);
      return false;
    }
    return true;
  };

  return requireLogin;
};
