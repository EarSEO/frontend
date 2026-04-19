import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";

import CourseIcon from "@/components/icons/tabs/CourseIcon";
import MyRouteIcon from "@/components/icons/tabs/MyRouteIcon";

import { theme } from "@/styles/theme";

import { useNavigationBarStore } from "@/store/common/useNavigationBarStore";

export default function TabLayout() {
  const pathname = usePathname();
  const currentMapType = pathname.startsWith("/sight")
    ? "sight"
    : pathname.startsWith("/route")
      ? "route"
      : pathname.startsWith("/story")
        ? "story"
        : null;
  const { isNavigationBarHidden } = useNavigationBarStore();
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: isNavigationBarHidden
          ? { display: "none" }
          : {
              paddingTop: 15,
              paddingHorizontal: 10,
              borderTopWidth: 1,
              position: "static",
              overflow: "hidden",
              borderTopColor: theme.colors.grey.neutral200,
              backgroundColor: theme.colors.white,
            },
      }}
    >
      <Tabs.Screen
        name="docent"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="headset-outline"
              size={28}
              weght={1}
              color={focused ? theme.colors.main.primary : theme.colors.black}
            />
          ),
        }}
      />

      {/*@deprecated*/}

      <Tabs.Screen
        name="(route)/[mapType]"
        options={{
          title: "route",
          href: {
            pathname: "/(tabs)/(index)/[mapType]",
            params: { mapType: "route" },
          },
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => {
            color =
              currentMapType === "route"
                ? theme.colors.main.primary
                : theme.colors.black;
            return <MyRouteIcon size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="(index)/[mapType]"
        options={{
          title: "sight",
          href: {
            pathname: "/(tabs)/(index)/[mapType]",
            params: { mapType: "sight" },
          },
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => {
            color =
              currentMapType === "sight"
                ? theme.colors.main.primary
                : theme.colors.black;
            return <CourseIcon size={26} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="(story)/[mapType]"
        options={{
          title: "story",
          href: {
            pathname: "/(tabs)/(index)/[mapType]",
            params: { mapType: "story" },
          },
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => {
            color =
              currentMapType === "story"
                ? theme.colors.main.primary
                : theme.colors.black;
            return (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={28}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="myPage"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="person-outline"
              size={24}
              color={focused ? theme.colors.main.primary : theme.colors.black}
            />
          ),
        }}
      />
    </Tabs>
  );
}
