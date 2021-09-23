import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface trendState {
    loading: boolean;
    error: string | null;
    data: [string, number][];
}

const initialState: trendState = {
    loading: true,
    error: null,
    data: []
}

// interface argument {
//     dateStr: string;
//     from: string;
//     to: string;
// }

export const getTrend = createAsyncThunk("trend/getTrend", async (arg: any, thunkAPI) => {
    const { dateStr, from, to, source } = arg
    const { data } = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${dateStr}/currencies/${from}/${to}.json`, {
        cancelToken: source.token
    })

    return [dateStr, data[to]]
})

export const trendSlice = createSlice({
    name: "trend",
    initialState,
    reducers: {
        emptyTrend: (state) => {
            state.data = []
        }
    },
    extraReducers: {
        [getTrend.pending.type]: (state) => {
            state.loading = true
        },
        [getTrend.fulfilled.type]: (state, action) => {
            // console.log("action.payload", action.payload)
            state.loading = false
            state.error = null
            state.data = [...state.data, action.payload]
        },
        [getTrend.rejected.type]: (state, action: PayloadAction<string | null>) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})