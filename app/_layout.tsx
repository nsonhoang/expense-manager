import { SessionProvider } from "@/context/ctx";
import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
};

export default AppLayout;
