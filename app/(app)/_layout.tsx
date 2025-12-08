import { useSession } from "@/context/ctx";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)", // có thể bỏ cũng được, không bắt buộc
};

export default function RootLayout() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    // Loading state lần đầu mở app (đang load từ SecureStore)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Các màn hình chỉ cho phép khi ĐÃ đăng nhập */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        {/* Các màn hình auth (login/register) chỉ cho phép khi CHƯA đăng nhập */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
