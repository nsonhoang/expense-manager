import { SessionProvider } from "@/context/ctx";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AppLayout = () => {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </SessionProvider>
  );
};

export default AppLayout;
