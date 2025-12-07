import { mockExpenses, mockIncomes } from "@/constants/mockDataReport";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";


const CategoryAnnualReportScreen = () => {
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
    percent?: number;
  };

  // Tính phần trăm
  const calcPercent = (data: IncomeItem[]): IncomeItem[] => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data.map((item) => ({
      ...item,
      percent: Number(((item.value / total) * 100).toFixed(1)),
    }));
  };

  const incomes = calcPercent(mockIncomes);
  const expenses = calcPercent(mockExpenses) as ExpenseItem[];


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

  return (
  <SafeAreaView style={styles.container}>

    {/* TOP BAR */}
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Báo cáo danh mục năm</Text>

      <View style={{ width: 26 }} />
    </View>

    {/* YEAR SELECTOR */}
    <View style={styles.yearBox}>
      <TouchableOpacity>
        <Ionicons name="chevron-back" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.yearText}>2025</Text>

      <TouchableOpacity>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </TouchableOpacity>
    </View>

    {/* TAB */}
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => setSelectedTab("expense")}>
        <Text style={[styles.tab, selectedTab === "expense" && styles.tabActive]}>
          Chi tiêu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSelectedTab("income")}>
        <Text style={[styles.tab, selectedTab === "income" && styles.tabActive]}>
          Thu nhập
        </Text>
      </TouchableOpacity>
    </View>

    {/* PIE CHART WRAPPED CARD */}
    <View style={styles.chartCard}>
      <PieChart
        data={pieData}
        donut
        radius={80}
        innerRadius={38}
        textSize={12}
        showText={false}
        textColor="#fff"
        innerCircleColor="#fff"
      />
    </View>

    {/* CATEGORY LIST */}
    <FlatList
      data={dataToShow}
      keyExtractor={(i) => i.label + i.value}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons
              name={
                item.label === "Ăn uống" ? "restaurant" :
                item.label === "Y tế" ? "medkit" : 
                item.label === "Lương" ? "cash" :
                item.label === "Thưởng" ? "trophy" :
                item.label === "Di chuyển" ? "car" :
                item.label === "Giải trí" ? "game-controller" :
                item.label === "Mua sắm" ? "cart" :
                item.label === "Freelance" ? "laptop" :
                item.label === "Kinh doanh" ? "briefcase" :
                item.label === "Đầu tư" ? "trending-up" :
                item.label === "Cho thuê" ? "home" : "ellipse"
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
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  </SafeAreaView>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  yearBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    marginTop: 5,
    paddingBottom: 10,
  },

  yearText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 8,
  },

  tab: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#777",
  },

  tabActive: {
    color: "#4FC3F7",
    fontWeight: "700",
    borderBottomWidth: 2,
    borderBottomColor: "#4FC3F7",
  },

  chartCard: {
    alignItems: "center",
    marginVertical: 20,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },

  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 20,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemLabel: {
    fontSize: 16,
    color: "#000",
  },

  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemValue: {
    fontSize: 16,
    color: "#000",
  },

  itemPercent: {
    fontSize: 14,
    color: "#666",
  },
});


export default CategoryAnnualReportScreen;
