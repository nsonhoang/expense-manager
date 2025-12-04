import { useSession } from "@/context/ctx";
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MoreScreen = () => {
  const { signOut } = useSession();
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Bạn đang đăng nhập!</Text>

        <Button
          title="Đăng xuất"
          onPress={() => {
            signOut(); // xóa session
            router.replace("../(auth)"); // chuyển về màn đăng nhập
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default MoreScreen;
