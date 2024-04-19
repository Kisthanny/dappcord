import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getServerContract, getServerInfo, Server } from "../libs";

interface ServerState {
    serverList: Server[],
    currentServer: Server | null,
}

const initialState: ServerState = {
    serverList: [],
    currentServer: null
}

export const addServer = createAsyncThunk(
    'server/addServer',
    async (address: string) => {
        const contract = await getServerContract(address);
        if (contract) {
            return await getServerInfo(contract);
        }
        return null;
    }
)

export const updateServer = createAsyncThunk(
    'server/updateServer',
    async (address: string) => {
        const contract = await getServerContract(address);
        if (contract) {
            return await getServerInfo(contract);
        }
        return null;
    }
)

export const serverSlice = createSlice({
    name: 'server',
    initialState,
    reducers: {
        setCurrentServer: (state, action: PayloadAction<string>) => {
            const address = action.payload;
            const serverList = state.serverList;
            const server = serverList.find(e => e.address === address)
            if (server) {
                state.currentServer = server
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(addServer.fulfilled, (state, action) => {
            if (action.payload) {
                state.serverList.push(action.payload)
            }
        })
        builder.addCase(updateServer.fulfilled, (state, action) => {
            if (action.payload) {
                const newServer = action.payload;
                const index = state.serverList.findIndex(e => e.address === newServer.address)
                state.serverList.splice(index, 1, newServer)
                state.currentServer = newServer
            }
        })
    }
})

export const { setCurrentServer } = serverSlice.actions

export default serverSlice.reducer