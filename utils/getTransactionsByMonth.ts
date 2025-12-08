import { Transaction } from "@/app/(app)/(tabs)/calendar";

export function getTransactionsByMonth(
  data: Transaction[],
  month: number, // 1-12
  year: number
): Transaction[] {
  return data.filter((item) => {
    const d = item.date;
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}
