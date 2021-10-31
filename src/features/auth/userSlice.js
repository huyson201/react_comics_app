import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    refreshToken: null,
    userInfo: null,
    isLogged: false,
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.userInfo = null
      state.isLogged = false;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
      state.isLogged = true;
    }
  },
});

export const { login, logout, isCheck, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
