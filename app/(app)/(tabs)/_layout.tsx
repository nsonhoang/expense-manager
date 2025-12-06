import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Color } from "@/constants/GlobalValue";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Color.ICON_COLOR,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 70,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Quản lí tài chính",
          headerShown: true,

          headerShadowVisible: false,
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ fontSize: 12, color }}>Ghi</Text> : null,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="edit" size={focused ? 28 : 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Lịch",
          headerShown: true,
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ fontSize: 12, color }}>Lịch</Text> : null,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="calendar-month"
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Báo cáo",
          headerShown: true,
          tabBarLabel: ({ focused, color }) =>
            focused ? (
              <Text style={{ fontSize: 12, color }}>Báo cáo</Text>
            ) : null,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="analytics"
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more-screen"
        options={{
          title: "Thêm",
          headerShown: true,
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ fontSize: 12, color }}>Thêm</Text> : null,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="more-horiz"
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
