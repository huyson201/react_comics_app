import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import comicApi from "../../api/comicApi";

export const getComics = createAsyncThunk(
  "comics/getComics",
  async (params, thunkAPI) => {
    const index = thunkAPI.getState().comics.offset;
    thunkAPI.dispatch(removeSelectedCategory());
    const comics = await comicApi.getAll(index);
    return comics.data.data;
  }
);
export const getComicsByCategory = createAsyncThunk(
  "comics/getComicsByCategory",
  async (id, thunkAPI) => {
    const index = thunkAPI.getState().comics.offset;
    // thunkAPI.dispatch(getCategoryById(id));
    const comics = await comicApi.getComicsByCategory(id, index);
    console.log(comics.data.data);
    return comics.data.data;
  }
);
console.log(getComicsByCategory());

export const getComicsByKey = createAsyncThunk(
  "comics/searchByKey",
  async (key, thunkAPI) => {
    const index = thunkAPI.getState().comics.offset;
    const comics = await comicApi.getComicsByKeyword(key, index);
    return comics.data.data;
  }
);
export const getCategoryById = createAsyncThunk(
  "categories/selectedCategory",
  async (id) => {
    const categories = await comicApi.getCategoryById(id);
    return categories.data.data;
  }
);
const comicSlice = createSlice({
  name: "comics",
  initialState: {
    comics: [],
    count: 0,
    status: "",
    selectedCategory: null,
    offset: 0,
  },
  reducers: {
    removeSelectedCategory(state) {
      state.selectedCategory = null;
    },
    removeComicList(state) {
      state.comics = [];
    },
    setOffSet(state, action) {
      state.offset = action.payload;
    },
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
      state.comics = action.payload.rows;
      state.count = action.payload.count;
    },
    [getComicsByCategory.pending]: (state) => {
      state.status = "loading";
    },
    [getComicsByCategory.rejected]: (state) => {
      state.status = "rejected";
    },
    [getComicsByCategory.fulfilled]: (state, action) => {
      state.status = "success";
      state.comics = action.payload.rows[0].comics;
      state.count = action.payload.count;
    },
    [getCategoryById.pending]: (state) => {
      state.status = "loading";
    },
    [getCategoryById.rejected]: (state) => {
      state.status = "rejected";
    },
    [getCategoryById.fulfilled]: (state, action) => {
      state.status = "success";
      state.selectedCategory = action.payload;
    },
    [getComicsByKey.pending]: (state) => {
      state.status = "loading";
    },
    [getComicsByKey.rejected]: (state) => {
      state.status = "rejected";
    },
    [getComicsByKey.fulfilled]: (state, action) => {
      state.status = "success";
      state.comics = action.payload.rows;
      state.count = action.payload.count;
    },
  },
});
export const { removeSelectedCategory, removeComicList, setOffSet } =
  comicSlice.actions;
export const getAllComics = (state) => state.comics.comics;
export default comicSlice.reducer;
