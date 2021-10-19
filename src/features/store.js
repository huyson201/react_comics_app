import { configureStore } from "@reduxjs/toolkit";
import comicsReducer from "./comics/comicSlice";
import userReducer from "./auth/userSlice"
const store = configureStore({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
  },
});
export default store;