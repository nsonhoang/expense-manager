import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const ReportScreen = () => {
  // State: tab hiện tại
  const [selectedTab, setSelectedTab] = useState("expense"); // 'expense' | 'income'

  type IncomeItem = {
    label: string;
    value: number;
    color: string;
    percent?: number;
  };

  type ExpenseItem = {
    label: string;
    value: number;
    color: string;
    percent: number;
  };


  // Fake data
  const expensesRaw = [
    { label: "Ăn uống", value: 100000, color: "#FF8A00" },
    { label: "Y tế", value: 20000, color: "#6CF2B7" },
    { label: "Di chuyển", value: 50000, color: "#4C8BFF" },
    { label: "Giải trí", value: 30000, color: "#FF5A79" },
    { label: "Mua sắm", value: 40000, color: "#9B6BFF" },  
  ];

  const incomesRaw = [
    { label: "Lương", value: 900000, color: "#4FC3F7" },
    { label: "Thưởng", value: 100000, color: "#7BD389" },
    { label: "Freelance", value: 200000, color: "#FFD166" },
    { label: "Kinh doanh", value: 150000, color: "#EF476F" },
    { label: "Đầu tư", value: 100000, color: "#06D6A0" },
    { label: "Cho thuê", value: 50000, color: "#8E44AD" },
    { label: "Khác", value: 30000, color: "#118AB2" },
  ];

  const calcPercent = (data: IncomeItem[]): IncomeItem[] => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data.map((item) => ({
      ...item,
      percent: Number(((item.value / total) * 100).toFixed(1)),
    }));
  };

  const incomes = calcPercent(incomesRaw);
  const expenses = calcPercent(expensesRaw) as ExpenseItem[];


  // dữ liệu hiển thị tuỳ theo tab
  const dataToShow = selectedTab === "expense" ? expenses : incomes;

  // Pie data (memoized)
  const pieData = useMemo(
    () =>
      dataToShow.map((item) => ({
        value: item.value,
        color: item.color,
        text: item.percent + "%",
      })),
    [dataToShow]
  );

  // Tổng
  const totalExpense = expenses.reduce((s, i) => s + i.value, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.value, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* MONTH SELECTOR */}
      <View style={styles.monthBox}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <View style={styles.monthCenter}>
          <Text style={styles.monthText}>12/2025</Text>
          <Ionicons name="calendar-outline" size={18} color="#000" />
        </View>

        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Chi tiêu</Text>
            <Text style={[styles.summaryValue, { color: "#FF7043" }]}>
              -{totalExpense.toLocaleString()}đ
            </Text>
          </View>

          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Thu nhập</Text>
            <Text style={[styles.summaryValue, { color: "#4FC3F7" }]}>
              +{totalIncome.toLocaleString()}đ
            </Text>
          </View>
        </View>

        <View style={styles.summaryFooter}>
          <Text style={styles.footerText}>Thu chi </Text>
          <Text style={[styles.footerText, { fontWeight: "bold" }]}>
            +{(totalIncome - totalExpense).toLocaleString()}đ
          </Text>
        </View>
      </View>

      {/* TAB */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab("expense")}>
          <Text style={[styles.tabText, selectedTab === "expense" ? styles.tabActive : styles.tabInactive]}>
            Chi tiêu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedTab("income")}>
          <Text style={[styles.tabText, selectedTab === "income" ? styles.tabActive : styles.tabInactive]}>
            Thu nhập
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={70}
          innerRadius={30}
          textColor="white"
          textSize={12}
          showText
          innerCircleColor="#fff"
          strokeWidth={0.2}
        />
      </View>

      {/* CATEGORY LIST */}
      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.label + item.value}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons
                name={
                  item.label === "Ăn uống" ? "restaurant" : item.label === "Y tế" ? "medkit" : item.label === "Lương" ? "cash" : "arrow-up"
                }
                size={22}
                color={item.color}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>

            <View style={styles.itemRight}>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.itemValue}>{item.value.toLocaleString()}đ</Text>
                <Text style={styles.itemPercent}>{item.percent}%</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#777" />
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
        ListFooterComponent={<View style={{ height: 30 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  monthBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 10,
  },
  monthCenter: { flexDirection: "row", alignItems: "center", gap: 5 },
  monthText: { fontSize: 18, fontWeight: "600", color: "#000" },

  summaryCard: {
    backgroundColor: "#f4f4f4",
    margin: 15,
    borderRadius: 10,
    padding: 15,
    borderColor: "#333",
    borderWidth: 0.1,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryCol: { alignItems: "center", flex: 1 },
  summaryLabel: { color: "#000", fontSize: 14 },
  summaryValue: { fontSize: 18, marginTop: 4, fontWeight: "bold" },
  summaryFooter: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: { color: "#161313", fontSize: 16 },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  tabText: { fontSize: 16, paddingVertical: 8 },
  tabActive: { color: "#4FC3F7", fontWeight: "700", borderBottomWidth: 2, borderBottomColor: "#4FC3F7" },
  tabInactive: { color: "#777" },

  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  chartLabel: { marginTop: 8, fontSize: 14, color: "#333" },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 0,
    alignItems: "center",
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemLabel: { fontSize: 16, color: "#000" },
  itemValue: { color: "#000", fontSize: 16 },
  itemPercent: { color: "#777", fontSize: 14 },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 8 },
});

export default ReportScreen;
