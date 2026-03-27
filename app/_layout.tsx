import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { LocationSubscription } from "expo-location";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import * as Updates from "expo-updates";
import { ThemeProvider } from "styled-components";

import { useLocation } from "@/hooks/useLocation";

import { theme } from "@/styles/theme";
import { GEOFENCE_TASK } from "@/constants/taskManagerTaskKeys";

import {
  geofenceTask,
  isGeofenceActive,
} from "@/services/geofence/geofenceService";
import { setAudioModeDuckOthers } from "@/store/docent/useAudioPlayerStore";
import { useBaseMapStore } from "@/store/useBaseMapStore";
import { useRouteStore } from "@/store/route/useRouteStore";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

TaskManager.defineTask(GEOFENCE_TASK, geofenceTask);
setAudioModeDuckOthers();

useBaseMapStore.subscribe((state, prevState) => {
  if (state.mapRef !== prevState.mapRef) {
    console.log("[참조 변경 감지]", new Date().toISOString());
    console.log("이전:", prevState.mapRef);
    console.log("이후:", state.mapRef);
    console.trace(); // 호출 스택 출력
  }
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("../src/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("../src/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Regular": require("../src/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../src/assets/fonts/Pretendard-Medium.otf"),
  });

  // EAS ota Upadte
  useEffect(() => {
    if (__DEV__) return;
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error("Update error:", error);
      }
    };

    checkForUpdates();
  }, []);

  // 앱 종료 전에 진행중이던 경로 종료
  useEffect(() => {
    isGeofenceActive().then((active) => {
      if (active) {
        useRouteStore.getState().finishRoute();
      }
    });
  }, []);

  // 클라이언트 위치 초기화 및 구독
  const { isPositionLoading, watchPositionAsync } = useLocation();
  useEffect(() => {
    let subscription: LocationSubscription | undefined;

    (async () => {
      subscription = await watchPositionAsync().finally(() => {
        // 클라이언트 위치 초기화 & 맵 로딩 완료 후 스플래시 스크린 제거
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 500);
      });
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = {
        fontFamily: "Pretendard-Regular",
      };
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isPositionLoading && fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500);
    }
  }, [isPositionLoading, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <GestureHandlerRootView>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
          />
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
