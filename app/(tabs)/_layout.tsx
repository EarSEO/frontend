import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import CourseIcon from "@/components/icons/tabs/CourseIcon";
import MyRouteIcon from "@/components/icons/tabs/MyRouteIcon";

import { theme } from "@/styles/theme";

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 15,
          paddingTop: 15,
          paddingHorizontal: 10,
          borderTopWidth: 1,
          position: "absolute",
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
      <Tabs.Screen
        name="myRoute"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <MyRouteIcon
              size={24}
              color={focused ? theme.colors.main.primary : theme.colors.black}
            ></MyRouteIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <CourseIcon
              size={26}
              color={focused ? theme.colors.main.primary : theme.colors.black}
            ></CourseIcon>
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
              color={focused ? theme.colors.main.primary : theme.colors.black}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="[username]"
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
