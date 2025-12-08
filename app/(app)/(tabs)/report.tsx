import { categoryIcons } from "@/constants/categoryIcons";
import { useSession } from "@/context/ctx";
import { formatMoney } from "@/utils/formatMoney";
import { Ionicons } from "@expo/vector-icons";
import {
  collection, FirebaseFirestoreTypes, getFirestore,
  onSnapshot,
  orderBy,
  query
} from "@react-native-firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
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

const ReportScreen = () => {
  const { user } = useSession();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [allTrans, setAllTrans] = useState<Transaction[]>([]);
  const [selectedTab, setSelectedTab] = useState<"expense" | "income">(
    "expense"
  );

  // ---------------- FIREBASE LISTENER ----------------
  useEffect(() => {
    if (!user) return;

    const ref = collection(
      getFirestore(),
      "User",
      user.uid,
      "Transactions"
    );

    const unsub = onSnapshot(
      query(ref, orderBy("date", "desc")),
      (snap) => {
        setAllTrans(
          snap.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const d = doc.data();
            return {
              id: doc.id,
              money: d.money || 0,
              note: d.note || "",
              category: d.category || "Khác",
              isExpense: d.isExpense ?? true,
              date: d.date.toDate(),
            };
          })
        );
      }
    );

    return unsub;
  }, [user]);

  // ---------------- CHUYỂN THÁNG ----------------
  const changeMonth = useCallback(
    (dir: number) => {
      let m = month + dir;
      let y = year;

      if (m === 0) {
        m = 12;
        y--;
      } else if (m === 13) {
        m = 1;
        y++;
      }

      setMonth(m);
      setYear(y);
    },
    [month, year]
  );

  // ----------- TÍNH TOÁN TẤT CẢ TRONG 1 useMemo -----------
  const {
    totalExpense,
    totalIncome,
    dataToShow,
    pieData,
  } = useMemo(() => {
    const dataMonth = allTrans.filter(
      (item) =>
        item.date.getMonth() + 1 === month &&
        item.date.getFullYear() === year
    );

    const totalExpense = dataMonth
      .filter((i) => i.isExpense)
      .reduce((s, i) => s + i.money, 0);

    const totalIncome = dataMonth
      .filter((i) => !i.isExpense)
      .reduce((s, i) => s + i.money, 0);

    const group = (isExpense: boolean) => {
      const map = new Map<string, number>();

      dataMonth
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

    const dataToShow =
      selectedTab === "expense" ? expenses : incomes;

    const pieData = dataToShow.map((i) => ({
      value: i.value,
      color: i.color,
      text: i.percent + "%",
    }));

    return {
      totalExpense,
      totalIncome,
      dataToShow,
      pieData,
    };
  }, [allTrans, month, year, selectedTab]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* MONTH SELECTOR */}
      <View style={styles.monthBox}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <View style={styles.monthCenter}>
          <Text style={styles.monthText}>{`${month}/${year}`}</Text>
          <Ionicons name="calendar-outline" size={18} color="#000" />
        </View>

        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* SUMMARY */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Chi tiêu</Text>
            <Text style={[styles.summaryValue, { color: "#FF7043" }]}>
              -{formatMoney(totalExpense)}
            </Text>
          </View>

          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Thu nhập</Text>
            <Text style={[styles.summaryValue, { color: "#4FC3F7" }]}>
              +{formatMoney(totalIncome)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryFooter}>
          <Text style={styles.footerText}>Thu chi </Text>
          <Text style={[styles.footerText, { fontWeight: "bold" }]}>
            {formatMoney(totalIncome - totalExpense)}
          </Text>
        </View>
      </View>

      {/* TAB */}
      <View style={styles.tabContainer}>
        {["expense", "income"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab
                  ? styles.tabActive
                  : styles.tabInactive,
              ]}
            >
              {tab === "expense" ? "Chi tiêu" : "Thu nhập"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PIE CHART */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={75}
          innerRadius={35}
          showText={false}
          innerCircleColor="#fff"
          strokeWidth={0.5}
        />
      </View>

      {/* Khi không có dữ liệu */}
      {dataToShow.length === 0 && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#999", fontSize: 16 }}>Không có dữ liệu</Text>
        </View>
      )}

      {/* LIST */}
      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.label}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons
                name={categoryIcons[item.label] || "ellipse"}
                size={20}
                color={item.color}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
            </View>

            <View style={styles.itemRight}>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.itemValue}>
                  {formatMoney(item.value)}
                </Text>
                <Text style={styles.itemPercent}>
                  {item.percent}%
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#777"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  monthBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    alignItems: "center",
  },
  monthCenter: { flexDirection: "row", alignItems: "center", gap: 5 },
  monthText: { fontSize: 18, fontWeight: "600", color: "#000" },

  summaryCard: {
    backgroundColor: "#f4f4f4",
    margin: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
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
  tabActive: {
    color: "#4FC3F7",
    fontWeight: "700",
    borderBottomWidth: 2,
    borderBottomColor: "#4FC3F7",
  },
  tabInactive: { color: "#777" },

  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },

  separator: {
    height: 1,
    backgroundColor: "#eee",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemLabel: { fontSize: 16, color: "#000" },
  itemValue: { color: "#000", fontSize: 16 },
  itemPercent: { color: "#777", fontSize: 14 },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 8 },
});
