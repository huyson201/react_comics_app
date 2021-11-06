import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import chapApi from "../../api/chapApi";

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
        console.log(params);
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

const chapterSlice = createSlice({
    name: "chapter",
    initialState: chapterAdapter.getInitialState({
        status: "loading",
        count: 0,
        offset: 0,
    }),
    reducers: {
        removeChapList(state) {
            chapterAdapter.removeAll(state);
            state.status = "loading";
        },
        setOffSet(state, action) {
            state.offset = action.payload;
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
            console.log(action.payload)
            chapterAdapter.removeOne(state, action.payload);
        },
    },
});

export const { removeChapList, setOffSet } = chapterSlice.actions;
export default chapterSlice.reducer;
