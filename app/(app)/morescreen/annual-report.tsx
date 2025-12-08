import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = [
  { key: "expense", label: "Chi tiêu" },
  { key: "income", label: "Thu nhập" },
  { key: "total", label: "Tổng" },
];

const SCREEN_PADDING = 32;
const BAR_GAP = 8;
const SCALE = 1000;

/** Cho phép nhận cả undefined/null để an toàn khi truyền giá trị không chắc */
const formatVND = (n: number | null | undefined) =>
  typeof n === "number" ? n.toLocaleString("vi-VN") + "đ" : "0đ";

const MonthItem = React.memo(({ month, value }: any) => (
  <View style={styles.monthItem}>
    <Text style={styles.monthName}>Tháng {month}</Text>
    <Text style={styles.monthValue}>{formatVND(value)}</Text>
  </View>
));

const AnnualReportScreen = () => {
  const [year, setYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("expense");
  const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width);

  /** Fake dữ liệu - chú ý: khai báo Record<string, number[]> để Index bằng string không lỗi */
  const data: Record<string, number[]> = useMemo(
    () => ({
      expense: Array(11).fill(0).concat(120000),
      income: [50000, ...Array(10).fill(0), 100000],
      total: [50000, ...Array(10).fill(0), 220000],
    }),
    [year]
  );

  /** Tổng năm */
  const totalOfYear = useMemo(
    () => data[activeTab].reduce((s, x) => s + Number(x || 0), 0),
    [data, activeTab]
  );

  /** Tính toán chiều rộng cột */
  const barChartConfig = useMemo(() => {
    const count = 12;
    const availableWidth = chartWidth - SCREEN_PADDING * 2;
    const barWidth = Math.min(
      48,
      Math.max(10, (availableWidth - BAR_GAP * (count - 1)) / count)
    );

    return { barWidth, spacing: BAR_GAP, initialSpacing: 8 };
  }, [chartWidth]);

  /** Data chart */
  const chartData = useMemo(
    () =>
      data[activeTab].map((v, i) => ({
        value: Math.round(v / SCALE),
        label: `${i + 1}`,
        frontColor: v > 0 ? "#177AD5" : "#e0e0e0",
      })),
    [data, activeTab]
  );

  const onChartLayout = useCallback(
    (e: any) => {
      const w = e.nativeEvent.layout.width;
      if (w && Math.abs(w - chartWidth) > 1) setChartWidth(w);
    },
    [chartWidth]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Báo cáo trong năm</Text>

        <View style={{ width: 26 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* YEAR CONTROLS */}
        <View style={styles.yearBar}>
          <TouchableOpacity onPress={() => setYear((y) => y - 1)}>
            <Text style={styles.arrow}>{"<"}</Text>
          </TouchableOpacity>

          <View style={styles.yearBox}>
            <Text style={styles.yearText}>
              {year} <Text style={styles.rangeText}>(01/01 - 31/12)</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={() => setYear((y) => y + 1)}>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, active && styles.activeTab]}
                onPress={() => setActiveTab(t.key)}
              >
                <Text style={[styles.tabText, active && styles.activeTabText]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* BAR CHART */}
        <View style={styles.chartOuter} onLayout={onChartLayout}>
          <BarChart
            data={chartData}
            barWidth={barChartConfig.barWidth}
            spacing={barChartConfig.spacing}
            initialSpacing={barChartConfig.initialSpacing}
            noOfSections={4}
            barBorderRadius={6}
            yAxisThickness={0}
            xAxisThickness={0}
            roundedTop
          />
        </View>

        {/* TOTAL */}
        <View style={styles.totalWrapper}>
          <Text style={styles.totalLabel}>Tổng</Text>
          <Text style={styles.totalValue}>{formatVND(totalOfYear)}</Text>
        </View>

        {/* MONTH LIST */}
        <View style={styles.monthList}>
          {data[activeTab].map((v, i) => (
            <MonthItem key={i} month={i + 1} value={v} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnnualReportScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
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

  arrow: {
    fontSize: 24,
    color: "#555",
  },

  yearBar: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },

  yearBox: {
    backgroundColor: "#fff2d9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  yearText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },

  rangeText: {
    fontSize: 12,
    color: "#666",
  },

  tabs: {
    flexDirection: "row",
    paddingBottom: 8,
    gap: 8,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ff8c00",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  activeTab: {
    backgroundColor: "#ff8c00",
  },

  tabText: {
    color: "#ff8c00",
    fontSize: 15,
    fontWeight: "600",
  },

  activeTabText: {
    color: "#fff",
  },

  chartOuter: {
    marginTop: 8,
    paddingVertical: 12,
    minHeight: 220,
  },

  totalWrapper: {
    backgroundColor: "#f7f7f7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },

  totalValue: {
    fontSize: 18,
    color: "#1e90ff",
    fontWeight: "700",
  },

  monthList: {
    marginTop: 8,
  },

  monthItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  monthName: {
    fontSize: 16,
    fontWeight: "500",
  },

  monthValue: {
    fontSize: 16,
    color: "#555",
  },
});
