import CalendarWithDot from "@/components/tabCalendar/CalendarWithDot";
import DetailMoney from "@/components/tabCalendar/detailMoney";
import { mockFormInputs } from "@/constants/mockValue";
import { useSession } from "@/context/ctx";
import { formatMoney } from "@/utils/formatMoney";
import { getTransactionsByMonth } from "@/utils/getTransactionsByMonth";
import {
  collection,
  FirebaseFirestoreTypes,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export interface Transaction {
  id: string;
  date: Date;
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
}

export default function CalendarScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const { user } = useSession();
  // lấy danh sách giao dịch của tháng đó

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    const db = getFirestore();
    const transRef = collection(db, "User", user.uid, "Transactions");

    // Sắp xếp theo ngày giảm dần
    const q = query(transRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const list: Transaction[] = [];

        querySnapshot.forEach(
          (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = doc.data();

            // Firestore trả về Timestamp, cần convert sang Date
            let dateObj = data.date.toDate();
            console.log("ngayf" + dateObj);

            list.push({
              id: doc.id,
              money: data.money || 0,
              note: data.note || "",
              category: data.category || "Khác",
              isExpense: data.isExpense ?? true,
              date: dateObj, // Dùng ngày thực tế từ DB
            });
          }
        );

        setTransactions(list); // Lưu dữ liệu thật vào State
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi lấy danh sách:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]); // Thêm dependency user
  console.log("alo: " + transactions);

  const dataMonth = getTransactionsByMonth(transactions, month, year);

  const { totalExpense, totalIncome, total } = useMemo(() => {
    let expense = 0;
    let income = 0;
    let totalValue = 0;
    dataMonth.map((item) => {
      if (item.isExpense) {
        expense += item.money;
      } else {
        income += item.money;
      }
    });
    totalValue = income - expense;
    return { totalExpense: expense, totalIncome: income, total: totalValue };
  }, [dataMonth]);

  const selectedItems = mockFormInputs.filter(
    (item) => item.date.toISOString().split("T")[0] === selected
  );
  console.log(selectedItems);
  console.log("Tháng mới:", month, "Năm:", year);
  console.log(selected);
  return (
    <ScrollView>
      <View style={styles.screen}>
        <CalendarWithDot
          selectDate={selected}
          updateSelectDate={setSelected}
          month={month}
          year={year}
          updateMonth={(m, y) => {
            setMonth(m);
            setYear(y);
          }}
          listData={transactions}
        />
        <View style={styles.totalMoney}>
          {/* Thu nhập */}
          <View style={styles.itemTotal}>
            <Text style={styles.label}>Thu nhập</Text>
            <Text style={[styles.labelMoney, styles.income]}>
              {formatMoney(totalIncome)}
            </Text>
          </View>

          <View style={styles.lines} />

          {/* Chi tiêu */}
          <View style={styles.itemTotal}>
            <Text style={styles.label}>Chi tiêu</Text>
            <Text style={[styles.labelMoney, styles.expense]}>
              {formatMoney(totalExpense)}
            </Text>
          </View>

          <View style={styles.lines} />

          {/* Tổng */}
          <View style={styles.itemTotal}>
            <Text style={[styles.label, styles.totalLabel]}>Tổng</Text>

            <Text
              style={[
                styles.labelMoney,
                total > 0
                  ? styles.totalPositive
                  : total < 0
                  ? styles.totalNegative
                  : styles.totalZero,
              ]}
            >
              {formatMoney(total)}
            </Text>
          </View>
        </View>
        {/* chi tiết chi tiêu */}
        <View>
          <DetailMoney ListData={dataMonth} month={month} year={year} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  totalMoney: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 2, // bóng nhẹ trên Android
    shadowColor: "#000", // bóng nhẹ trên iOS
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  itemTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },

  labelMoney: {
    fontSize: 17,
    fontWeight: "700",
  },

  income: {
    color: "#1e9e56", // xanh đậm đẹp
  },

  expense: {
    color: "#d9534f", // đỏ đẹp
  },

  lines: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 4,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "600",
  },

  totalPositive: {
    color: "#1e9e56", // xanh
  },

  totalNegative: {
    color: "#d9534f", // đỏ
  },

  totalZero: {
    color: "#777",
  },
});
