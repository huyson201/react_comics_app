import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
      token: null,
      refreshToken: null,
    },
    reducers: {
        login(state,action) {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken
        },
        logout(state){
            state.token = null;
            state.refreshToken = null;
        },
    },
  });
  
  export const {login, logout} = userSlice.actions
  export default userSlice.reducer;