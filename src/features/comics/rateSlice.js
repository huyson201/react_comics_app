import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rateApi from "../../api/rateApi";

export const getRateByUserId = createAsyncThunk(
    "rates/getRateByUserId",
    async ({ userId, comicId }) => {
        const rate = await rateApi.getRateComic(userId, comicId);
        return rate.data.data.rows[0];
    }
);

const rateSlice = createSlice({
    name: "rate",
    initialState: {
        perRate: 0,
        count: 0,
        star: null,
        check: false,
        rateState: null,
        status: "loading"

    },
    reducers: {
        calRate(state, action) {
            state.perRate = action.payload.perRate;
            state.count = action.payload.count;
        },
        starRateIndex(state, action) {
            state.star = action.payload
        },
        checkRate(state, action) {
            state.check = action.payload
        },
        setRate(state, action) {
            state.rateState = action.payload
        }
    },
    extraReducers: {
        [getRateByUserId.pending]: (state) => {
            state.status = "loading";
        },
        [getRateByUserId.rejected]: (state) => {
            state.status = "rejected";
        },
        [getRateByUserId.fulfilled]: (state, action) => {
            state.status = "success";
            state.rateState = action.payload;
        },

    },
});

export const { calRate, starRateIndex, checkRate, setRate } = rateSlice.actions;
export default rateSlice.reducer;
