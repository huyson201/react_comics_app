import { createSlice } from "@reduxjs/toolkit";
const modalSlice = createSlice({
  name: "modal",
  initialState: {
    show: false,
    error: null,
    message: null,
    showChapter: false,
    check: false,
  },
  reducers: {
    modalNotify(state, action) {
      state.show = action.payload.show;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
    modalChapter(state, action) {
      state.showChapter = action.payload.showChapter;
    },
    checkRate(state, action) {
      state.check = action.payload;
    },
  },
});

export const { modalNotify, modalChapter,checkRate } = modalSlice.actions;
export default modalSlice.reducer;
