import { createSlice } from "@reduxjs/toolkit";
const chapterSlice = createSlice({
    name: "chapter",
    initialState: {
        chapter: null,
    },
    reducers: {
        setChapters(state, action) {
            state.chapter = action.payload
        },
    },
});

export const { setChapters } = chapterSlice.actions;
export default chapterSlice.reducer;
