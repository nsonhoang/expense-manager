import { useSession } from "@/context/ctx";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Transaction {
  id: string;
  date: Date;
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
}

const format = (num: number) => num?.toLocaleString("vi-VN") ?? "0";

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
  const { user } = useSession();

  const [allTrans, setAllTrans] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // load transactions từ Firestore: User/{uid}/Transactions
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
            date: d.date?.toDate?.() ?? new Date(),
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

  // tính toán thu/chi/tổng (toàn kì)
  const { income, expense, total, startBalance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    allTrans.forEach((t) => {
      if (t.isExpense) expense += t.money;
      else income += t.money;
    });

    // startBalance: nếu bạn lưu trên user profile thì có thể thay; hiện mặc định = 0
    const startBalance = 0;

    return { income, expense, total: income - expense, startBalance };
  }, [allTrans]);

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      ) : allTrans.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 16, color: "#777" }}>Không có dữ liệu</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* BLOCK 1 */}
          <View style={styles.block}>
            <Row label="Thu nhập" value={income} />
            <Row label="Chi tiêu" value={expense} />
            <Row label="Tổng" value={total} />
          </View>

          {/* BLOCK 2 */}
          <View style={styles.block}>
            <Row label="Số dư ban đầu" value={startBalance} />
            <Row label="Tổng" value={total} />
          </View>
        </ScrollView>
      )}
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
