import CalendarWithDot from "@/components/tabCalendar/CalendarWithDot";
import DetailMoney from "@/components/tabCalendar/detailMoney";
import { mockFormInputs } from "@/constants/mockValue";
import { formatMoney } from "@/utils/formatMoney";
import { getTransactionsByMonth } from "@/utils/getTransactionsByMonth";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CalendarScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [selected, setSelected] = useState(today);
  //tiêu tiền tháng đó
  // const [totalExpense, setTotalExpense] = useState(0);
  // //tiền vào tháng đó
  // const [totalIncome, setTotalIncome] = useState(0);
  // //tổng tiền trong tháng đó
  // const [total, setTotal] = useState(totalIncome - totalExpense);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  // lấy danh sách giao dịch của tháng đó
  const dataMonth = getTransactionsByMonth(mockFormInputs, month, year);

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
