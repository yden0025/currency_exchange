import { createSlice } from "@reduxjs/toolkit";

interface openDateState {
    openDate: string
}

const initialState: openDateState = {
    openDate: "2021-01-01"
}

export const openDateSlice = createSlice({
    name: "openDate",
    initialState,
    reducers: {},
})