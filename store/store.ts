import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import transactionsReducer from "../features/transaction/transactionSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    // thêm các reducer khác nếu cần
    user: userReducer,
    transactions: transactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // cái này cho thunk
