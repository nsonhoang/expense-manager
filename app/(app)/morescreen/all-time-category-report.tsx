import { categoryIcons } from "@/constants/categoryIcons";
import { useSession } from "@/context/ctx";
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
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

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

const AllCategoryAnnualReportScreen = () => {
  const { user } = useSession();

  // State: tab hiện tại
  const [selectedTab, setSelectedTab] = useState<"expense" | "income">(
    "expense"
  );

  const [allTrans, setAllTrans] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // FIREBASE LISTENER -> lấy toàn bộ transactions (toàn thời gian)
  useEffect(() => {
    if (!user) {
      setAllTrans([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = collection(getFirestore(), "User", user.uid, "Transactions");
    const q = query(ref, orderBy("date", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Transaction[] = snap.docs.map((doc) => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            money: d.money || 0,
            note: d.note || "",
            category: d.category || "Khác",
            isExpense: d.isExpense ?? true,
            // safe convert timestamp -> Date
            date: d.date && typeof d.date.toDate === "function"
              ? d.date.toDate()
              : new Date(),
          } as Transaction;
        });

        setAllTrans(list);
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore onSnapshot error:", err);
        setAllTrans([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  // Nếu bạn muốn test nhanh: dùng mock data khi allTrans rỗng
  // const testTrans = useMemo(() => mockExpenses.concat(mockIncomes), []);
  // setAllTrans(...) // <- optional for dev

  // Gom nhóm theo category và tính percent (toàn thời gian)
  const { expenses, incomes, dataToShow, pieData } = useMemo(() => {
    const group = (isExpense: boolean) => {
      const map = new Map<string, number>();

      allTrans
        .filter((t) => t.isExpense === isExpense)
        .forEach((t) => {
          const label = t.category || "Khác";
          map.set(label, (map.get(label) || 0) + (t.money || 0));
        });

      return [...map.entries()].map(([label, value], index) => ({
        label,
        value,
        color: COLORS[index % COLORS.length],
      }));
    };

    const calcPercent = (arr: { label: string; value: number; color: string }[]) => {
      const total = arr.reduce((s, i) => s + i.value, 0);
      if (total === 0) {
        return arr.map((i) => ({ ...i, percent: 0 }));
      }
      return arr.map((i) => ({
        ...i,
        percent: Number(((i.value / total) * 100).toFixed(1)),
      }));
    };

    const expenses = calcPercent(group(true));
    const incomes = calcPercent(group(false));

    const dataToShow = selectedTab === "expense" ? expenses : incomes;

    const pieData = dataToShow.map((i) => ({
      value: i.value,
      color: i.color,
      text: (i.percent ?? 0) + "%",
    }));

    return { expenses, incomes, dataToShow, pieData };
  }, [allTrans, selectedTab]);

  // Khi loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>

          <Text style={styles.screenTitle}>Toàn thời gian</Text>

          <View style={{ width: 26 }} />
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Toàn thời gian</Text>

        <View style={{ width: 26 }} />
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
        {dataToShow.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#999", fontSize: 16 }}>Không có dữ liệu</Text>
          </View>
        ) : (
          <PieChart
            data={pieData}
            donut
            radius={80}
            innerRadius={38}
            showText={false}
            textSize={12}
            textColor="#fff"
            innerCircleColor="#fff"
          />
        )}
      </View>

      {/* CATEGORY LIST */}
      {dataToShow.length === 0 ? null : (
        <FlatList
          data={dataToShow}
          keyExtractor={(i) => i.label + i.value}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Ionicons
                  name={categoryIcons[item.label] || "ellipse"}
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
      )}
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

export default AllCategoryAnnualReportScreen;
