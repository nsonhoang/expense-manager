import { Color, TextSize } from "@/constants/GlobalValue";
import { useSession } from "@/context/ctx";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const router = useRouter();

  // Lấy hàm signInWithGoogle và thông tin user từ Context
  const { signInWithGoogle, user } = useSession();

  // State để hiển thị loading khi đang bấm nút
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Tự động chuyển trang nếu đã có user (Phòng trường hợp user tắt app mở lại)
  useEffect(() => {
    if (user) {
      router.replace("../(tabs)");
    }
  }, [user]); //  Dependency array quan trọng

  const handleLogin = async () => {
    if (isSigningIn) return; // Chặn bấm liên tục
    setIsSigningIn(true);
    try {
      // Gọi hàm đăng nhập từ Context
      await signInWithGoogle();
      // Nếu thành công, useEffect ở trên sẽ tự chuyển trang

      console.log("đăng nhập thành công");
    } catch (error) {
      Alert.alert(
        "Lỗi đăng nhập",
        "Không thể đăng nhập bằng Google. Vui lòng thử lại."
      );
    } finally {
      setIsSigningIn(false);
    }
  };
  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/logo_cat.png")} />

      <TouchableOpacity
        style={[styles.button, isSigningIn && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={isSigningIn}
      >
        {isSigningIn ? (
          <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
        ) : (
          <Image
            source={require("../../../assets/images/logo-google.png")}
            style={{ height: 24, width: 24, marginRight: 10 }}
          />
        )}

        <Text style={styles.title}>
          {isSigningIn ? "Đang đăng nhập..." : "Đăng nhập với Google"}
        </Text>
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});

export default LoginScreen;
