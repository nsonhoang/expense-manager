import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

// Import các reducers của bạn

import transactionsReducer from "@/features/transaction/transactionSlice";

// Cấu hình persist chung
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // Chỉ định những slice nào bạn muốn lưu
  whitelist: ["transactions"],
};

// Kết hợp tất cả các reducers của bạn lại
const rootReducer = combineReducers({
  transactions: transactionsReducer,
  // Thêm các reducers khác ở đây
});

// Tạo một persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
