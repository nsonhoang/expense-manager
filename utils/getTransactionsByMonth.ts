import { FormInput } from "@/app/(app)/(tabs)";

export function getTransactionsByMonth(
  data: FormInput[],
  month: number, // 1-12
  year: number
): FormInput[] {
  return data.filter((item) => {
    const d = item.date;
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}
