import { configureStore } from "@reduxjs/toolkit";
import comicsReducer from "./comics/comicSlice";
import userReducer from "./auth/userSlice"
import categorySlice from "./comics/categorySlice";
import followSlice from "./comics/followSlice";
const store = configureStore({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    categories : categorySlice,  
    follow :followSlice,
  },
});
export default store;