import { useCallback } from "react";

import { Animated, Pressable, Text } from "react-native";

import { useRouter } from "expo-router";
import { MapPinPlusIcon } from "lucide-react-native";

import { theme } from "@/styles/theme";
import View = Animated.View;

const GoGetCourseButton: React.FC = () => {
  const addCourseText = "경로 추가하러 가기";
  const router = useRouter();
  const onPress = useCallback(() => {
    router.push("/");
  }, []);
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: theme.spacing.md,
          padding: theme.spacing.xs,
          backgroundColor: theme.colors.background.background500,
          borderRadius: theme.borderRadius.lg,
        }}
      >
        <MapPinPlusIcon />
        <Text
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.text.textPrimary,
            padding: theme.spacing.xs,
          }}
        >
          {addCourseText}
        </Text>
      </View>
    </Pressable>
  );
};

export default GoGetCourseButton;
