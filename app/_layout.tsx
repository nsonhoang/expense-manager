import { SessionProvider } from "@/context/ctx";
import { store } from "@/store/store";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

const AppLayout = () => {
  return (
    <Provider store={store}>
      <SessionProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </SessionProvider>
    </Provider>
  );
};

export default AppLayout;
