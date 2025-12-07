import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockData = {
  income: 1000000,
  expense: 120000,
  total: 880000,
  startBalance: 0,
};

const format = (num: number) => num.toLocaleString("vi-VN");

// Row component
const Row = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.right}>
      <Text style={styles.value}>{format(value)}</Text>
      <Text style={styles.currency}>đ</Text>
    </View>
  </View>
);

export default function AllTimeReportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Báo cáo toàn kì</Text>

        <View style={{ width: 26 }} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* BLOCK 1 */}
        <View style={styles.block}>
          <Row label="Thu nhập" value={mockData.income} />
          <Row label="Chi tiêu" value={mockData.expense} />
          <Row label="Tổng" value={mockData.total} />
        </View>

        {/* BLOCK 2 */}
        <View style={styles.block}>
          <Row label="Số dư ban đầu" value={mockData.startBalance} />
          <Row label="Tổng" value={mockData.total} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },

  /** HEADER */
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  /** BLOCK */
  block: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  /** ROW */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginRight: 4,
  },
  currency: {
    fontSize: 15,
    color: "#777",
  },
});
