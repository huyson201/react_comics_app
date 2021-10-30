import { createSlice } from "@reduxjs/toolkit";
const rateSlice = createSlice({
    name: "rate",
    initialState: {
        perRate: 0,
        count: 0,
        star: null,
        check: false
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
        }
    },
});

export const { calRate, starRateIndex, checkRate } = rateSlice.actions;
export default rateSlice.reducer;
