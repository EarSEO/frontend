import { Stack } from "expo-router";

export default function StoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "메인 스토리" }} />
      <Stack.Screen name="storyAdd" options={{ title: "스토리 등록" }} />
    </Stack>
  );
}
