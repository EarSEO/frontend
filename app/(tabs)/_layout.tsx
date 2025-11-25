import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import CouresIcon from "@/components/icons/CourseIcon";
import MyRouteIcon from "@/components/icons/MyRouteIcon";

import { theme } from "@/styles/theme";

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          borderTopWidth: 1,
          position: "absolute",
          overflow: "hidden",
          borderTopColor: theme.colors.neutral300,
          borderTopLeftRadius: theme.borderRadius.xl,
          borderTopRightRadius: theme.borderRadius.xl,
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
              color={focused ? theme.colors.primary : theme.colors.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myRoute"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <MyRouteIcon
              size={28}
              color={focused ? theme.colors.primary : theme.colors.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <CouresIcon
              size={28}
              color={focused ? theme.colors.primary : theme.colors.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="story"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              size={28}
              color={focused ? theme.colors.primary : theme.colors.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="[username]"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name="user"
              size={28}
              color={focused ? theme.colors.primary : theme.colors.black}
            />
          ),
        }}
      />
    </Tabs>
  );
}
