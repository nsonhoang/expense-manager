import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
} from "@react-native-firebase/firestore";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "./transactionTypes";

// Đây là kiểu dữ liệu mẫu, bạn hãy thay thế bằng kiểu dữ liệu thực tế của mình

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
};

// 1. Tạo một async thunk để fetch dữ liệu
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (userId: string, thunkAPI) => {
    if (!userId) {
      // Nếu không có userId, từ chối thunk hoặc trả về mảng rỗng
      return thunkAPI.rejectWithValue("No user ID provided");
    }
    try {
      const db = getFirestore();
      // Sử dụng `userId` được truyền vào, không phải `user.uid`
      const transRef = collection(db, "User", userId, "Transactions");

      // Sắp xếp theo ngày giảm dần
      const q = query(transRef, orderBy("date", "desc"));

      // Sử dụng getDocs để lấy dữ liệu một lần
      const querySnapshot = await getDocs(q);

      const list: Transaction[] = [];

      querySnapshot.forEach((doc: any) => {
        const data = doc.data();

        // Firestore trả về Timestamp, cần convert sang Date
        const dateObj = (data.date as Timestamp).toDate();

        list.push({
          id: doc.id,
          money: data.money || 0,
          note: data.note || "",
          category: data.category || "Khác",
          isExpense: data.isExpense ?? true,
          date: dateObj,
        });
      });

      return list; // Trả về danh sách giao dịch
    } catch (error: any) {
      // Xử lý lỗi và trả về lỗi qua thunkAPI
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.items = action.payload;
    },
    addTransaction: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.items = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to fetch transactions:", action.payload);
      });
  },
});

export const { setTransactions, addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
