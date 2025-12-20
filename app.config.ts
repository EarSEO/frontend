import "dotenv/config";
import { version } from "./package.json";

export default {
  expo: {
    name: "이어서",
    slug: "earseo",
    version: version,
    orientation: "portrait",
    icon: "./src/assets/images/earseo-icon.png",
    scheme: "earseo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
    ios: {
      bundleIdentifier: "com.earseo.earseo",
      supportsTablet: true,
      appleTeamId: "W39CU54NKB",
      infoPlist: {
        UIBackgroundModes: ["audio", "location"],
      },
      config: {
        usesNonExemptEncryption: false
      },
      icon: "./src/assets/earseo-ios.icon",
      displayName: "이어서",
    },
    android: {
      package: "com.earseo.earseo",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./src/assets/images/earseo-icon.png",
        backgroundImage: "./src/assets/images/earseo-icon.png",
        monochromeImage: "./src/assets/images/earseo-icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      label: "이어서",
    },
    web: {
      output: "static",
      favicon: "./src/assets/images/earseo-icon.png",
    },
    plugins: [
      "react-native-maps",
      "expo-web-browser",
      "expo-secure-store",
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/earseo-transparent-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          dark: {
            backgroundColor: "#1e2127",
          },
        },
      ],
      [
        "expo-location",
        {
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
