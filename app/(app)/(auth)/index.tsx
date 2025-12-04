import { useSession } from "@/context/ctx";
import { useRouter } from "expo-router";

import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const LoginScreen = () => {
  const router = useRouter();
  const { signIn } = useSession();

  const handleDevLogin = () => {
    signIn("dev-fake-token");
    console.log("session tạo xong");
    router.replace("../(tabs)");
    console.log("alo");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button title="Dev Login (fake)" onPress={handleDevLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default LoginScreen;
