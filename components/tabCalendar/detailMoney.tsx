import { FormInput } from "@/app/(app)/(tabs)";
import { Transaction } from "@/app/(app)/(tabs)/calendar";
import { Color } from "@/constants/GlobalValue";
import { formatMoney } from "@/utils/formatMoney";
import { groupTransactionsByDay } from "@/utils/getTransactionsByDate";
import { StyleSheet, Text, View } from "react-native";
import ItemDetailMoney from "./itemDetailMoney";

interface DetailMoneyProps {
  ListData: Transaction[];
  month: number;
  year: number;
}
export interface DayGroup {
  dateKey: string;
  items: Transaction[];
}

function DetailMoney({ ListData, month, year }: DetailMoneyProps) {
  const groups = groupTransactionsByDay(ListData);
  function calcTotal(items: FormInput[]) {
    return items.reduce((sum, item) => {
      return sum + (item.isExpense ? -item.money : item.money);
    }, 0);
  }

  function formatDate(iso: string) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}`;
  }

  return (
    <View style={styles.container}>
      {groups.map((group) => {
        const total = calcTotal(group.items);

        return (
          <View key={group.dateKey} style={{ marginBottom: 10 }}>
            {/* HEADER NGÀY */}
            <View style={styles.containerLabel}>
              <Text style={styles.date}>{formatDate(group.dateKey)}</Text>
              <Text
                style={[
                  styles.totalMoney,
                  total < 0 ? styles.expense : styles.income,
                ]}
              >
                {formatMoney(total)}
              </Text>
            </View>

            {/* LIST ITEM */}
            {group.items.map((item, idx) => (
              <ItemDetailMoney key={idx} item={item} />
            ))}
          </View>
        );
      })}

      {groups.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 10, height: 50 }}>
          Không có giao dịch trong tháng {month}/{year}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 15,
  },
  containerLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e0f7fa",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  date: {
    fontWeight: 800,
    color: "grey",
  },
  totalMoney: {
    fontWeight: 800,
    color: "grey",
  },
  income: {
    color: Color.PRIMARY_COLOR,
  },
  expense: {
    color: "red",
  },
});

export default DetailMoney;
