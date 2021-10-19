import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import comicApi from "../../api/comicApi";

export const getComics = createAsyncThunk(
  "comics/getComics",
  async (params, thunkAPI) => {
    const comics = await comicApi.getAll(params);
    return comics.data.data;
  }
);
const comicSlice = createSlice({
  name: "comics",
  initialState: {
    comics: [],
    status: '',
  },
  reducers: {
  },
  extraReducers: {
    [getComics.pending]: (state) => {
      state.status = "loading";
    },
    [getComics.rejected]: (state) => {
      state.status = "rejected";
    },
    [getComics.fulfilled]: (state, action) => {
      state.status = "success";
      state.comics = action.payload;
    },
  },
});

export const getAllComics = (state) => state.comics.comics
export default comicSlice.reducer;
