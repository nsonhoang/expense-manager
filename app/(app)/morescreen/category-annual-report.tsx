import { categoryIcons } from "@/constants/categoryIcons";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const COLORS = [
  "#FF7043",
  "#4FC3F7",
  "#FFCA28",
  "#66BB6A",
  "#AB47BC",
  "#EC407A",
];

interface Transaction {
  id: string;
  date: Date;
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
}

const CategoryAnnualReportScreen = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [selectedTab, setSelectedTab] = useState<"expense" | "income">(
    "expense",
  );

  const [allTrans, setAllTrans] = useState<Transaction[]>([]);

  // ---------------- FIREBASE LISTENER ----------------
  useEffect(() => {
    if (!user) return;

    const ref = collection(getFirestore(), "User", user.uid, "Transactions");

    const unsub = onSnapshot(query(ref, orderBy("date", "desc")), (snap) => {
      setAllTrans(
        snap.docs.map((doc: { data: () => any; id: any }) => {
          const d = doc.data();
          return {
            id: doc.id,
            money: d.money || 0,
            note: d.note || "",
            category: d.category || "Khác",
            isExpense: d.isExpense ?? true,
            date: d.date.toDate(),
          };
        }),
      );
    });

    return unsub;
  }, [user]);

  // ---------------- ĐỔI NĂM ----------------
  const changeYear = (dir: number) => {
    setYear((y) => y + dir);
  };

  // ---------------- TÍNH TOÁN THEO NĂM ----------------
  const { expenses, incomes, dataToShow, pieData } = useMemo(() => {
    const dataYear = allTrans.filter(
      (item) => item.date.getFullYear() === year,
    );

    const group = (isExpense: boolean) => {
      const map = new Map<string, number>();

      dataYear
        .filter((i) => i.isExpense === isExpense)
        .forEach((t) => {
          map.set(t.category, (map.get(t.category) || 0) + t.money);
        });

      return [...map.entries()].map(([label, value], index) => ({
        label,
        value,
        color: COLORS[index % COLORS.length],
      }));
    };

    const calcPercent = (arr: any[]) => {
      const total = arr.reduce((s, i) => s + i.value, 0);
      return arr.map((i) => ({
        ...i,
        percent: total ? Number(((i.value / total) * 100).toFixed(1)) : 0,
      }));
    };

    const expenses = calcPercent(group(true));
    const incomes = calcPercent(group(false));

    const dataToShow = selectedTab === "expense" ? expenses : incomes;

    const pieData = dataToShow.map((i) => ({
      value: i.value,
      color: i.color,
      text: i.percent + "%",
    }));

    return { expenses, incomes, dataToShow, pieData };
  }, [allTrans, year, selectedTab]);

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
        <TouchableOpacity onPress={() => changeYear(-1)}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.yearText}>{year}</Text>

        <TouchableOpacity onPress={() => changeYear(1)}>
          <Ionicons name="chevron-forward" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* TAB */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab("expense")}>
          <Text
            style={[styles.tab, selectedTab === "expense" && styles.tabActive]}
          >
            Chi tiêu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedTab("income")}>
          <Text
            style={[styles.tab, selectedTab === "income" && styles.tabActive]}
          >
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
          showText={false}
          innerCircleColor="#fff"
        />
      </View>

      {/* EMPTY STATE */}
      {dataToShow.length === 0 && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#999", fontSize: 16 }}>Không có dữ liệu</Text>
        </View>
      )}

      {/* LIST */}
      <FlatList
        data={dataToShow}
        keyExtractor={(i) => i.label}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons
                name={(categoryIcons[item.label] as any) || "ellipse"}
                size={22}
                color={item.color}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>

            <View style={styles.itemRight}>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.itemValue}>
                  {item.value.toLocaleString()}đ
                </Text>
                <Text style={styles.itemPercent}>{item.percent}%</Text>
              </View>
              {/* <Ionicons
                name="chevron-forward"
                size={20}
                color="#aaa"
              /> */}
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </SafeAreaView>
  );
};

export default CategoryAnnualReportScreen;

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
    backgroundColor: "#fafafa",
    padding: 20,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },

  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },

  itemLabel: { fontSize: 16, color: "#000" },

  itemRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  itemValue: { color: "#000", fontSize: 16 },

  itemPercent: { color: "#777", fontSize: 14 },

  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
});
