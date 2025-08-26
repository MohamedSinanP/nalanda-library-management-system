import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Auth, User } from "../../types/type";

const initialState: Auth = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAuth, setAccessToken, setUser, removeAuth } = authSlice.actions;
export default authSlice.reducer;
