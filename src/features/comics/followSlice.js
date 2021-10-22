import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import followApi from "../../api/followApi";
import { removeComicList } from "./comicSlice";
export const followComic = createAsyncThunk(
  "follow/create",
  async ({id,userToken},thunkAPI) => {
    const res = await followApi.followComics(id,userToken);
    console.log(res)
    return res.data.data;
  }
);
export const getComicsFollow = createAsyncThunk(
  "follow/getComicsFollow",
  async ({id,userToken},thunkAPI) => {
    thunkAPI.dispatch(removeComicList())
    const res = await followApi.getFollowUser(id,userToken);
    console.log(res.data.data)
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
    [followComic.pending]: (state) => {
      state.status = "loading";
    },
    [followComic.rejected]: (state) => {
      state.status = "rejected";
    },
    [followComic.fulfilled]: (state, action) => {
      state.status = "success";
    },
    [getComicsFollow.pending]: (state) => {
      state.status = "loading";
    },
    [getComicsFollow.rejected]: (state) => {
      state.status = "rejected";
    },
    [getComicsFollow.fulfilled]: (state, action) => {
      state.status = "success";
      state.comics = action.payload.comics_follow
    },
  },
});
export default followSlice.reducer;
