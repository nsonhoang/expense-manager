import { Color, TextSize } from "@/constants/GlobalValue";
import { useSession } from "@/context/ctx";
import { useRouter } from "expo-router";

import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      <Image source={require("../../../assets/images/logo_cat.png")} />
      <TouchableOpacity style={styles.button} onPress={handleDevLogin}>
        <Text style={styles.title}>Đăng nhập với tài khoản Google </Text>
        <Image
          source={require("../../../assets/images/logo-google.png")}
          style={{ height: 24, width: 24 }}
        />
      </TouchableOpacity>
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
    fontSize: TextSize.TEXT_DEFAULT,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    flexDirection: "row",
    backgroundColor: Color.PRIMARY_COLOR,
    padding: 10,
    borderRadius: 10,
  },
});

export default LoginScreen;
