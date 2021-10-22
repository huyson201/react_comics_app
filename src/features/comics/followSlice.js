import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import followApi from "../../api/followApi";
export const followComic = createAsyncThunk(
  "followComic",
  async () => {
    const res = await followApi.followComics();
    return res.data.data;
  }
);

const followSlice = createSlice({
  name: "follows",
  initialState: {
    comics: [],
    status: "",
  },
  reducers: {
  },
  extraReducers: {
    // [getCategories.pending]: (state) => {
    //   state.status = "loading";
    // },
    // [getCategories.rejected]: (state) => {
    //   state.status = "rejected";
    // },
    // [getCategories.fulfilled]: (state, action) => {
    //   state.status = "success";
    //   state.categories = action.payload;
    // },
  },
});
export default followSlice.reducer;
