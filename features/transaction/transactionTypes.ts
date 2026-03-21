export interface Transaction {
  id: string;
  date: Date;
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
}
