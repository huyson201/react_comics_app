import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import comicApi from "../../api/comicApi";
export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    const categories = await comicApi.getAllCategories();
    return categories.data.data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    status: "",
  },
  reducers: {
  },
  extraReducers: {
    [getCategories.pending]: (state) => {
      state.status = "loading";
    },
    [getCategories.rejected]: (state) => {
      state.status = "rejected";
    },
    [getCategories.fulfilled]: (state, action) => {
      state.status = "success";
      state.categories = action.payload;
    },
  },
});
export default categorySlice.reducer;
