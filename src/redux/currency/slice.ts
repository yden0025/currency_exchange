import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface currencyState {
    loading: boolean;
    error: string | null;
    data: { [index: string]: string };
}

const initialState: currencyState = {
    loading: true,
    error: null,
    data: {}
}

export const getCurrency = createAsyncThunk("currency/getCurrency", async (thunkAPI) => {
    const { data } = await axios.get(
        "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json"
    );
    return data;
})

export const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {},
    extraReducers: {
        [getCurrency.pending.type]: (state) => {
            state.loading = true
        },
        [getCurrency.fulfilled.type]: (state, action) => {
            state.loading = false
            state.error = null
            state.data = action.payload
        },
        [getCurrency.rejected.type]: (state, action: PayloadAction<string | null>) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})