import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ServerState {
    serverList: string[],
    currentServer: string,
}

const initialState: ServerState = {
    serverList: [],
    currentServer: ''
}

export const serverSlice = createSlice({
    name: 'server',
    initialState,
    reducers: {
        setCurrentServer: (state, action: PayloadAction<string>) => {
            state.currentServer = action.payload;
        },
        addServer: (state, action: PayloadAction<string>) => {
            const address = action.payload;
            if (state.serverList.includes(address)) {
                return;
            }
            state.serverList.push(address)
        }
    },
})

export const { setCurrentServer, addServer } = serverSlice.actions

export default serverSlice.reducer