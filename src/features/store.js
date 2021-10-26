import { configureStore } from "@reduxjs/toolkit";
import comicsReducer from "./comics/comicSlice";
import userReducer from "./auth/userSlice";
import categorySlice from "./comics/categorySlice";
import followSlice from "./comics/followSlice";
import modalSlice from "./modal/modalSlice";
const store = configureStore({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    categories: categorySlice,
    follows: followSlice,
    modal: modalSlice,
  },
});
export default store;
