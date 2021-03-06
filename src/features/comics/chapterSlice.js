import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import chapApi from "../../api/chapApi";
import comicApi from "../../api/comicApi";

const chapterAdapter = createEntityAdapter({
  selectId: (chapter) => chapter.chapter_id,
});
export const chapterSelectors = chapterAdapter.getSelectors(
  (state) => state.chapter
);

export const getChapsByComicId = createAsyncThunk(
  "chapters/getChaptersByComicId",
  async (params, thunkAPI) => {
    const index = thunkAPI.getState().chapter.offset;
    const chapters = await chapApi.getChapterByComicId(params, index);
    // console.log(params);
    return chapters.data.data;
  }
);

export const deleteChapter = createAsyncThunk(
  "chapters/delete",
  async ({ id, token }, thunkAPI) => {
    await chapApi.delete(id, token);
    return id;
  }
);

export const deleteAllChapter = createAsyncThunk(
  "chapters/deleteAll",
  async ({ listId, token }, thunkAPI) => {
    listId.forEach(async (el) => {
      const res = await chapApi.delete(el, token);
      console.log(res.data);
    });
    return listId;
  }
);

export const getChapterByChapID = createAsyncThunk(
  "chapters/getChaptersById",
  async (params, thunkAPI) => {
    // const index = thunkAPI.getState().chapter.offset;
    const chapters = await comicApi.getChapterByID(params);
    return chapters.data.data;
  }
);

const chapterSlice = createSlice({
  name: "chapter",
  initialState: chapterAdapter.getInitialState({
    status: "",
    count: 0,
    offset: 0,
    chap: null,
    checkAll: false,
  }),
  reducers: {
    removeChapList(state) {
      chapterAdapter.removeAll(state);
      state.status = "loading";
    },
    setOffSet(state, action) {
      state.offset = action.payload;
    },
    resetChap(state) {
      state.chap = null;
      state.status = "";
    },
    setCheckAll(state, { payload }) {
      state.checkAll = payload;
    },
  },
  extraReducers: {
    [getChapsByComicId.pending]: (state) => {
      state.status = "loading";
    },
    [getChapsByComicId.rejected]: (state) => {
      state.status = "rejected";
    },
    [getChapsByComicId.fulfilled]: (state, action) => {
      state.status = "success";
      console.log(action.payload);
      chapterAdapter.setAll(state, action.payload.rows);
      state.count = action.payload.count;
    },
    [deleteChapter.pending]: (state) => {
      state.status = "loading";
    },
    [deleteChapter.rejected]: (state) => {
      state.status = "rejected";
    },
    [deleteChapter.fulfilled]: (state, action) => {
      state.status = "success";
      console.log(action.payload);
      chapterAdapter.removeOne(state, action.payload);
      state.count = --state.count;
    },
    [deleteAllChapter.pending]: (state) => {
      state.status = "loading";
    },
    [deleteAllChapter.rejected]: (state) => {
      state.status = "rejected";
    },
    [deleteAllChapter.fulfilled]: (state, action) => {
      state.status = "success";
      console.log(action.payload);
      chapterAdapter.removeAll(state);
      state.count = 0;
    },
    [getChapterByChapID.pending]: (state) => {
      state.status = "loading";
    },
    [getChapterByChapID.rejected]: (state) => {
      state.status = "rejected";
    },
    [getChapterByChapID.fulfilled]: (state, action) => {
      state.status = "success";
      state.chap = action.payload;
      // state.chapImgs = action.payload.chapter_imgs.split(",");
      // state.chapName = action.payload.chapter_name;
    },
  },
});

export const { removeChapList, setOffSet, resetChap, setCheckAll } =
  chapterSlice.actions;
export default chapterSlice.reducer;
