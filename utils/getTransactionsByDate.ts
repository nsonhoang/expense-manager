import { FormInput } from "@/app/(app)/(tabs)";
import { DayGroup } from "@/components/tabCalendar/detailMoney";

export function getTransactionsByDate(
  data: FormInput[],
  dateString: string // dạng "2025-01-05"
): FormInput[] {
  return data.filter((item) => {
    const itemDate = item.date.toISOString().split("T")[0];
    return itemDate === dateString;
  });
}
export function groupTransactionsByDay(data: FormInput[]): DayGroup[] {
  const map: Record<string, FormInput[]> = {};

  data.forEach((item) => {
    const key = item.date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });

  // chuyển sang mảng + sort ngày mới → cũ
  return Object.entries(map)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([dateKey, items]) => ({
      dateKey,
      items,
    }));
}
