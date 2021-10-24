import { createAsyncThunk, createSlice, unwrapResult } from "@reduxjs/toolkit";
import followApi from "../../api/followApi";
import { removeComicList, removeSelectedCategory } from "./comicSlice";
export const followComic = createAsyncThunk(
  "follow/create",
  async ({ id, userToken }, thunkAPI) => {
    const res = await followApi.followComics(id, userToken);
    return res.data.data;
  }
);
export const getComicsFollow = createAsyncThunk(
  "follow/getComicsFollow",
  async ({ id, userToken }, thunkAPI) => {
    thunkAPI.dispatch(removeComicList());
    thunkAPI.dispatch(removeSelectedCategory());
    const res = await followApi.getFollowUser(id, userToken);
    return res.data.data;
  }
);
export const deleteComicFollow = createAsyncThunk(
  "follow/delete",
  async ({ user_id, comic_id, userToken }, thunkAPI) => {
    const action = await thunkAPI.dispatch(
      getFollowID({ user_id: user_id, comic_id: comic_id })
    );
    const id = unwrapResult(action);
    const res = await followApi.deleteFollow(id, userToken);
    return res.data.data;
  }
);
export const getFollowID = createAsyncThunk(
  "follow/getByID",
  async ({ user_id, comic_id }, thunkAPI) => {
    const res = await followApi.getFollow(user_id, comic_id);
    return res.data.data.rows[0].follow_id;
  }
);
const followSlice = createSlice({
  name: "follows",
  initialState: {
    comics: [],
    status: "",
  },
  reducers: {
    deleteComic(state, action) {
      state.comics.splice(action.payload, 1);
    },
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
      state.comics = action.payload.comics_follow;
    },
    [deleteComicFollow.pending]: (state) => {
      state.status = "loading";
    },
    [deleteComicFollow.rejected]: (state) => {
      state.status = "rejected";
    },
    [deleteComicFollow.fulfilled]: (state) => {
      state.status = "success";
    },
  },
});
export const { deleteComic } = followSlice.actions;
export default followSlice.reducer;
