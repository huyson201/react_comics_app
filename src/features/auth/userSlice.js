import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
      token: null,
      refreshToken: null,
      isLogged: false,
    },
    reducers: {
        login(state,action) {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken
            state.isLogged = true;
        },
        logout(state){
            state.token = null;
            state.refreshToken = null;
            state.isLogged = false;
        },
    },
  });
  
  export const {login, logout} = userSlice.actions
  export default userSlice.reducer;