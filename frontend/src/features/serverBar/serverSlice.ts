import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const serverSlice = createSlice({
    name: 'server',
    initialState: {
        serverList: [],
        currentServer: {},
    },
    reducers: {
        setCurrentServer: (state) => { },
        addServer: (state,action: PayloadAction<string>) => { }
    }
})

export const { setCurrentServer, addServer } = serverSlice.actions

export default serverSlice.reducer