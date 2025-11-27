import { useEffect } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "styled-components";

import { theme } from "@/styles/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("../src/assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("../src/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Regular": require("../src/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../src/assets/fonts/Pretendard-Medium.otf"),
  });

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
