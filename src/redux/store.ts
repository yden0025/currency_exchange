import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { openDateSlice } from "./openDate/slice"
import { currencySlice } from "./currency/slice";
import { trendSlice } from "./trend/slice";

const rootReducer = combineReducers({
    openDate: openDateSlice.reducer,
    currency: currencySlice.reducer,
    trend: trendSlice.reducer,
})

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
})

export type RootState = ReturnType<typeof store.getState>

export default store;