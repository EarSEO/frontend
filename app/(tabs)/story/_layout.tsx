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
      <Stack.Screen
        name="spotLocationSelected"
        options={{
          title: "스팟 위치 등록",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="spotNameSelected"
        options={{
          title: "스팟 이름 등록",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
