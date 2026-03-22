import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  FirebaseFirestoreTypes,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useSelector } from "react-redux";

/** Cho phép nhận cả undefined/null để an toàn khi truyền giá trị không chắc */
const formatVND = (n: number | null | undefined) =>
  typeof n === "number" ? n.toLocaleString("vi-VN") + "đ" : "0đ";

// eslint-disable-next-line react/display-name
const MonthItem = React.memo(
  ({ month, value }: { month: number; value: number }) => {
    return (
      <View style={styles.monthItem}>
        <Text style={styles.monthName}>Tháng {month}</Text>
        <Text style={styles.monthValue}>{formatVND(value)}</Text>
      </View>
    );
  },
);

type Transaction = {
  id: string;
  date: Date;
  money: number;
  isExpense: boolean;
  category?: string;
  note?: string;
};

const TABS = [
  { key: "expense", label: "Chi tiêu" },
  { key: "income", label: "Thu nhập" },
  { key: "total", label: "Tổng" },
];

const SCREEN_PADDING = 32;
const BAR_GAP = 8;
const SCALE = 1000;

const AnnualReportScreen = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<"expense" | "income" | "total">(
    "expense",
  );
  const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width);

  const [allTrans, setAllTrans] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FIRESTORE LISTENER ----------------
  useEffect(() => {
    if (!user?.uid) {
      setAllTrans([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const db = getFirestore();
    const ref = collection(db, "User", user.uid, "Transactions");
    const q = query(ref, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snap: FirebaseFirestoreTypes.QuerySnapshot) => {
        const list: Transaction[] = snap.docs.map((doc) => {
          const d = doc.data() as any;
          // safe convert
          const date =
            d?.date?.toDate && typeof d.date.toDate === "function"
              ? d.date.toDate()
              : d?.date
                ? new Date(d.date)
                : new Date();

          return {
            id: doc.id,
            date,
            money: Number(d?.money || 0),
            isExpense: d?.isExpense ?? true,
            category: d?.category ?? "Khác",
            note: d?.note ?? "",
          };
        });

        setAllTrans(list);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setAllTrans([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // ---------------- AGGREGATE MONTHLY (income/expense/total) ----------------
  const monthly = useMemo(() => {
    // initialize 12 months
    const income = Array<number>(12).fill(0);
    const expense = Array<number>(12).fill(0);

    allTrans.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() !== year) return;
      const idx = d.getMonth(); // 0..11
      if (t.isExpense) expense[idx] += t.money;
      else income[idx] += t.money;
    });

    // total = income - expense (month by month)
    const total = income.map((inc, i) => inc - expense[i]);

    return { income, expense, total };
  }, [allTrans, year]);

  // prepare data object like original mock structure
  const data = useMemo(
    () => ({
      expense: monthly.expense,
      income: monthly.income,
      total: monthly.total,
    }),
    [monthly],
  );

  /** Tổng năm cho active tab */
  const totalOfYear = useMemo(
    () => data[activeTab].reduce((s, x) => s + Number(x || 0), 0),
    [data, activeTab],
  );

  /** Tính toán chiều rộng cột */
  const barChartConfig = useMemo(() => {
    const count = 12;
    const availableWidth = chartWidth - SCREEN_PADDING * 2;
    const barWidth = Math.min(
      48,
      Math.max(10, (availableWidth - BAR_GAP * (count - 1)) / count),
    );

    return { barWidth, spacing: BAR_GAP, initialSpacing: 8 };
  }, [chartWidth]);

  /** Data chart (scale values by SCALE) */
  const chartData = useMemo(
    () =>
      data[activeTab].map((v, i) => ({
        value: Math.round((v || 0) / SCALE),
        label: `${i + 1}`,
        frontColor:
          activeTab === "expense" && v > 0
            ? "#FF7043"
            : activeTab === "income" && v > 0
              ? "#4FC3F7"
              : v > 0
                ? "#177AD5"
                : "#e0e0e0",
      })),
    [data, activeTab],
  );

  const onChartLayout = useCallback(
    (e: any) => {
      const w = e.nativeEvent.layout.width;
      if (w && Math.abs(w - chartWidth) > 1) setChartWidth(w);
    },
    [chartWidth],
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
                onPress={() => setActiveTab(t.key as any)}
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

        {/* optional loading indicator */}
        {loading && (
          <View style={{ padding: 12, alignItems: "center" }}>
            <Text style={{ color: "#666" }}>Đang tải dữ liệu...</Text>
          </View>
        )}
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
