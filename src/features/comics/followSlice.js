import { createAsyncThunk, createSlice, unwrapResult } from "@reduxjs/toolkit";
import followApi from "../../api/followApi";
import { WARN_LOGIN } from "../../constants";
import { logout } from "../auth/userSlice";
import { modalNotify } from "../modal/modalSlice";
import { removeComicList, removeSelectedCategory } from "./comicSlice";
export const followComic = createAsyncThunk(
  "follow/create",
  async ({ id, userToken }, thunkAPI) => {
    try {
      const res = await followApi.followComics(id, userToken);
      return res.data.data;
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(logout());
      thunkAPI.dispatch(
        modalNotify({
          show: true,
          message: null,
          error: WARN_LOGIN,
        })
      );
    }
  }
);
export const getComicsFollow = createAsyncThunk(
  "follow/getComicsFollow",
  async ({ id, userToken }, thunkAPI) => {
    thunkAPI.dispatch(removeComicList());
    thunkAPI.dispatch(removeSelectedCategory());
    try {
      const res = await followApi.getFollowUser(id, userToken);
      console.log(res.data.data)
      return res.data.data;
    } catch (error) {
      console.log(error);
      // thunkAPI.dispatch(logout());
      // thunkAPI.dispatch(
      //   modalNotify({
      //     show: true,
      //     message: null,
      //     error: WARN_LOGIN,
      //   })
      // );
    }
  }
);
export const deleteComicFollow = createAsyncThunk(
  "follow/delete",
  async ({ user_id, comic_id, userToken }, thunkAPI) => {
    try {
      const action = await thunkAPI.dispatch(
        getFollowID({ user_id: user_id, comic_id: comic_id })
      );
      const id = unwrapResult(action);
      const res = await followApi.deleteFollow(id, userToken);
      return res.data.data;
    } catch (error) {
      // console.log(error);
      // thunkAPI.dispatch(logout());
      // thunkAPI.dispatch(
      //   modalNotify({
      //     show: true,
      //     message: null,
      //     error: WARN_LOGIN,
      //   })
      // );
    }
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
    removeFollowComic(state) {
      state.comics = []
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
      if (action.payload) {
        state.comics = action.payload.comics_follow;
      }
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
export const { deleteComic,removeFollowComic } = followSlice.actions;
export default followSlice.reducer;
