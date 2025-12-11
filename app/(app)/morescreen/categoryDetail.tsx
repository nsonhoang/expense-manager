// app/category-detail.tsx (hoặc screens/CategoryDetail.tsx)
import { useSession } from "@/context/ctx";
import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns"; // optional but handy (install if needed)
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts"; // vì project dùng gift charts
import { SafeAreaView } from "react-native-safe-area-context";

type Tx = {
  id: string;
  date: any; // firestore.Timestamp or Date
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
};

export default function CategoryDetail() {
  const params = useLocalSearchParams() as {
    category?: string;
    isExpense?: string;
  };
  const category = params.category || "";
  const isExpense = params.isExpense === "1";
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [txs, setTxs] = useState<Tx[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || !category) return;

    setLoading(true);
    const q = firestore()
      .collection("User")
      .doc(user.uid)
      .collection("Transactions")
      .where("category", "==", category)
      .where("isExpense", "==", isExpense)
      .orderBy("date", "asc");

    const unsub = q.onSnapshot(
      (snapshot) => {
        const data: Tx[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setTxs(data);
        setLoading(false);
      },
      (err) => {
        console.log("err fetch txs:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user, category, isExpense]);

  // helper: convert Firestore timestamp -> JS Date
  const toDate = (d: any) => {
    if (!d) return new Date();
    if (d.toDate) return d.toDate();
    if (d instanceof Date) return d;
    try {
      return new Date(d);
    } catch {
      return new Date();
    }
  };

  // Aggregate sums per day (label = dd/MM)
  const series = useMemo(() => {
    if (!txs.length) return { data: [], labels: [] };

    // Group by date string (yyyy-MM-dd)
    const map = new Map<string, number>();
    txs.forEach((t) => {
      const d = toDate(t.date);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const prev = map.get(key) || 0;
      map.set(key, prev + (t.money || 0));
    });

    // Convert map to sorted arrays
    const entries = Array.from(map.entries()).sort((a, b) =>
      a[0] < b[0] ? -1 : 1
    );
    const labels = entries.map(([k]) => {
      const d = new Date(k);
      return `${d.getDate()}/${d.getMonth() + 1}`; // dd/MM
    });
    const values = entries.map(([_, v]) => v);

    // build gifted-charts series format: [{value, label}, ...]
    const data = values.map((v, i) => ({ value: v, label: labels[i] }));

    return { data, labels };
  }, [txs]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Chi tiết: {category} — {isExpense ? "Chi tiêu" : "Thu nhập"}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {/* Bar Chart */}
          <View style={styles.chartWrap}>
            {series.data.length ? (
              <BarChart
                data={series.data}
                barWidth={18}
                isAnimated
                yAxisSuffix="đ"
                spacing={12}
                startFillColor="#4FC3F7"
                endFillColor="#0288D1"
                onPress={(idx, item) => {
                  // optional: show detail of day when press bar
                  console.log("pressed bar", idx, item);
                }}
                showReferenceLine={false}
                noOfSections={4}
              />
            ) : (
              <Text style={styles.noDataText}>
                Không có giao dịch để hiển thị biểu đồ
              </Text>
            )}
          </View>

          {/* Transaction list */}
          <FlatList
            data={txs.slice().reverse()} // show newest first
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => {
              const d = toDate(item.date);
              const dateStr = format
                ? format(d, "dd/MM/yyyy")
                : d.toLocaleDateString();
              return (
                <View style={styles.txRow}>
                  <View>
                    <Text style={styles.txDate}>{dateStr}</Text>
                    <Text style={styles.txNote}>{item.note || "-"}</Text>
                  </View>
                  <Text
                    style={[
                      styles.txMoney,
                      isExpense ? styles.expense : styles.income,
                    ]}
                  >
                    {(item.money || 0).toLocaleString()}đ
                  </Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  chartWrap: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  noDataText: { color: "#888" },
  txRow: {
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txDate: { fontSize: 14, fontWeight: "600" },
  txNote: { fontSize: 12, color: "#666" },
  txMoney: { fontSize: 16, fontWeight: "700" },
  expense: { color: "#E53935" },
  income: { color: "#2E7D32" },
});
