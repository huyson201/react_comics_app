import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    refreshToken: null,
    userInfo: null,
    isLogged: false,
    isAdmin: false,
    isCheckUpdate:false
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.userInfo = null;
      state.isLogged = false;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
      state.isLogged = true;
    },
    setIsAdmin(state, action) {
      state.isAdmin = action.payload;
    },
    setIsCheckUpdate(state, action) {
      state.isCheckUpdate = action.payload;
    },
  },
});

export const { login, logout, setIsCheckUpdate, setUserInfo, setIsAdmin } =
  userSlice.actions;
export default userSlice.reducer;
