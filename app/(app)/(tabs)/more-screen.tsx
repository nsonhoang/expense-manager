import { useSession } from "@/context/ctx";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const reportButtons = [
  { title: "Báo cáo trong năm", path: "annual-report", icon: "calendar-outline" },
  { title: "Báo cáo danh mục trong năm", path: "category-annual-report", icon: "grid-outline" },
  { title: "Báo cáo toàn kỳ", path: "all-time-report", icon: "time-outline" },
  { title: "Báo cáo danh mục toàn kỳ", path: "all-time-category-report", icon: "albums-outline" },
];

const MoreScreen = () => {
  const { signOut } = useSession();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        {reportButtons.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.button}
            onPress={() => router.push("/morescreen/" + item.path)}
          >
            <View style={styles.row}>
              <Ionicons name={item.icon} size={22} color="#2A2A2A" />
              <Text style={styles.buttonText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => {
          signOut();
          router.replace("/(auth)");
        }}
        style={styles.logoutBtn}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 20,
  },
  section: {
    gap: 14,
  },

  button: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },

  logoutBtn: {
    marginTop: "auto",
    padding: 16,
    backgroundColor: "#ff3b30",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MoreScreen;
