import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
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
    thunkAPI.dispatch(getCategoryById(id));
    const comics = await comicApi.getComicsByCategory(id, index);
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
export const getComicsByKey = createAsyncThunk(
  "comics/searchByKey",
  async (key, thunkAPI) => {
    thunkAPI.dispatch(removeSelectedCategory());
    const index = thunkAPI.getState().comics.offset;
    const comics = await comicApi.getComicsByKeyword(key, index);
    return comics.data.data;
  }
);
export const getComicsByFilters = createAsyncThunk(
  "comics/searchByFilters",
  async ({ categories, status,sort }, thunkAPI) => {
    thunkAPI.dispatch(removeSelectedCategory());
    const index = thunkAPI.getState().comics.offset;
    const comics = await comicApi.getComicByFilters(categories, status, index,sort);
    return comics.data;
  }
);

export const getComicByID = createAsyncThunk(
  "comics/selectedComic",
  async (id) => {
    const comic = await comicApi.getComicByID(id);
    return comic.data.data;
  }
);
export const createComic = createAsyncThunk(
  "comics/create",
  async ({ data, userToken }) => {
    const comic = await comicApi.createComic(data, userToken);
    console.log(comic.data.data)
    return comic.data.data;
  }
);
export const updateComic = createAsyncThunk(
  "comics/update",
  async ({ id, data, userToken }) => {
    const comic = await comicApi.updateComic(id, data, userToken);
    return comic.data.data;
  }
);
export const deleteComic = createAsyncThunk(
  "comics/delete",
  async ({ id, token }, thunkAPI) => {
    await comicApi.deleteComic(id, token);
    return id;
  }
);

export const deleteAllComic = createAsyncThunk(
  "chapters/deleteAll",
  async ({ listId, token }, thunkAPI) => {
    listId.forEach(async (el) => {
      const res = await comicApi.deleteComic(el, token);
      console.log(res.data);
    });
    return listId;
  }
);

const comicAdapter = createEntityAdapter({
  selectId: (comic) => comic.comic_id,
});
export const comicSelectors = comicAdapter.getSelectors(
  (state) => state.comics
);
const comicSlice = createSlice({
  name: "comics",
  initialState: comicAdapter.getInitialState({
    status: "",
    count: 0,
    offset: 0,
    selectedCategory: null,
    selectedComic: null,
    loading: false,
  }),
  reducers: {
    removeSelectedCategory(state) {
      state.selectedCategory = null;
    },
    removeComicList(state) {
      comicAdapter.removeAll(state);
      state.status = "loading";
      state.loading = false;
    },
    setOffSet(state, action) {
      state.offset = action.payload;
    },

    setStatus(state, action) {
      state.status = action.payload;
    },
    removeSelectedComic(state) {
      state.selectedComic = null;
      state.status = "";
    },
  },
  extraReducers: {
    [getComics.pending]: (state) => {
      state.status = "loading";
      state.loading = true;
    },
    [getComics.rejected]: (state) => {
      state.status = "rejected";
      state.loading = false;
    },
    [getComics.fulfilled]: (state, action) => {
      state.status = "success";
      state.loading = false;
      comicAdapter.setAll(state, action.payload.rows);
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
      comicAdapter.setAll(state, action.payload.rows[0].comics);
      state.count = action.payload.count;
    },
    [getCategoryById.pending]: (state) => {
      state.status = "loading";
    },
    [getCategoryById.rejected]: (state) => {
      state.status = "rejected";
    },
    [getCategoryById.fulfilled]: (state, action) => {
      // state.status = "success";
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
      comicAdapter.setAll(state, action.payload.rows);
      state.count = action.payload.count;
    },
    [getComicsByFilters.pending]: (state) => {
      state.status = "loading";
    },
    [getComicsByFilters.rejected]: (state) => {
      state.status = "rejected";
    },
    [getComicsByFilters.fulfilled]: (state, action) => {
      state.status = "success";
      comicAdapter.setAll(state, action.payload.rows);
      state.count = action.payload.count;
    },
    [deleteComic.pending]: (state) => {
      state.status = "loading";
    },
    [deleteComic.rejected]: (state) => {
      state.status = "rejected";
    },
    [deleteComic.fulfilled]: (state, action) => {
      state.status = "success";
      comicAdapter.removeOne(state, action.payload);
    },
    [deleteAllComic.pending]: (state) => {
      state.status = "loading";
    },
    [deleteAllComic.rejected]: (state) => {
      state.status = "rejected";
    },
    [deleteAllComic.fulfilled]: (state, action) => {
      state.status = "success";
      comicAdapter.removeAll(state);
    },
    [createComic.pending]: (state) => {
      state.status = "loading";
      state.loading = true;
    },
    [createComic.rejected]: (state) => {
      state.status = "rejected";
      state.loading = false;
    },
    [createComic.fulfilled]: (state, action) => {
      state.status = "success";
      comicAdapter.addOne(state, action.payload);
      state.loading = false;
    },
    [getComicByID.pending]: (state) => {
      state.status = "loading";
    },
    [getComicByID.rejected]: (state) => {
      state.status = "rejected";
    },
    [getComicByID.fulfilled]: (state, action) => {
      state.status = "success";
      state.selectedComic = action.payload;
    },
    [updateComic.pending]: (state) => {
      state.status = "loading";
      state.loading = true;
    },
    [updateComic.rejected]: (state) => {
      state.status = "rejected";
      state.loading = false;
    },
    [updateComic.fulfilled]: (state, action) => {
      state.status = "success";
      state.loading = false;
      console.log(action.payload);
    },
  },
});

export const {
  removeSelectedCategory,
  setOffSet,
  removeComicList,
  removeSelectedComic,
} = comicSlice.actions;
export default comicSlice.reducer;
