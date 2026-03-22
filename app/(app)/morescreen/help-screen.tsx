import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContactRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}


const ContactRow = ({ icon, label, value, onPress }: ContactRowProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={22} color="#555" />
    <View style={styles.rowText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </TouchableOpacity>
);


const TopBar = () => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={26} color="#333" />
    </TouchableOpacity>

    <Text style={styles.screenTitle}>Trợ giúp</Text>

    {/* giữ cân bằng title */}
    <View style={{ width: 26 }} />
  </View>
);

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ContactRow
        icon="call-outline"
        label="Hotline"
        value="0332656595"
        onPress={() => Linking.openURL("tel:0332656595")}
      />

      <ContactRow
        icon="mail-outline"
        label="Email"
        value="nhom8mobile@gmail.com"
        onPress={() => Linking.openURL("mailto:nhom8mobile@gmail.com")}
      />

      <ContactRow
        icon="location-outline"
        label="Địa chỉ"
        value="TP Hồ Chí Minh"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 15,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowText: {
    marginLeft: 12,
  },

  label: {
    fontSize: 14,
    color: "#666",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
    color: "#222",
  },
});
