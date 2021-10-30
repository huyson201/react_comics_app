import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    refreshToken: null,
    isCheckUpdate: false,
    isLogged: false,
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isLogged = true;
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.isLogged = false;
    },
    isCheck(state, action) {
      state.isCheckUpdate = action.payload;
    },
  },
});

export const { login, logout, isCheck } = userSlice.actions;
export default userSlice.reducer;
