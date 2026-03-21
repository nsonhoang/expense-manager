/// cái này để lưu thông tin người dùng

import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./userTypes";

const initialState: UserState = {
  user: null,
  loading: true, // Bắt đầu với trạng thái loading
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FirebaseAuthTypes.User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
