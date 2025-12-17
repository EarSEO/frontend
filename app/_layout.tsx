import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import { ThemeProvider } from "styled-components";

import { theme } from "@/styles/theme";
import { GEOFENCE_TASK } from "@/constants/taskManagerTaskKeys";

import {
  geofenceTask,
  isGeofenceActive,
} from "@/services/geofence/geofenceService";
import { setAudioModeDuckOthers } from "@/store/useAudioPlayerStore";
import { useRouteStore } from "@/store/useRouteStore";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

TaskManager.defineTask(GEOFENCE_TASK, geofenceTask);
setAudioModeDuckOthers();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("../src/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("../src/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Regular": require("../src/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../src/assets/fonts/Pretendard-Medium.otf"),
  });

  // 앱 종료 전에 진행중이던 경로 종료
  useEffect(() => {
    isGeofenceActive().then((active) => {
      if (active) {
        useRouteStore.getState().finishRoute();
      }
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = {
        fontFamily: "Pretendard-Regular",
      };
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "white" },
              }}
            />
          </GestureHandlerRootView>
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
