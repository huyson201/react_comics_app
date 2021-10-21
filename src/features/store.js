import { configureStore } from "@reduxjs/toolkit";
import comicsReducer from "./comics/comicSlice";
import userReducer from "./auth/userSlice"
import categorySlice from "./comics/categorySlice";
const store = configureStore({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    categories : categorySlice,  
  },
});
export default store;