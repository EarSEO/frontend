import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
          borderTopWidth: 0,
          position: "absolute",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.01,
          shadowRadius: 8,
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
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myRoute"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="extension-puzzle-outline"
              size={28}
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="map" size={24} color={focused ? "black" : "grey"} />
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
              color={focused ? "black" : "grey"}
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
              name="person"
              size={28}
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
