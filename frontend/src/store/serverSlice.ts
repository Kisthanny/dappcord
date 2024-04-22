import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getServerContract, getServerInfo, Server } from "../libs";

interface ServerState {
    serverList: Server[],
    currentServer: Server | null,
    isOwner: boolean,
}

const initialState: ServerState = {
    serverList: [],
    currentServer: null,
    isOwner: false,
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
        },
        setIsOwner: (state, action: PayloadAction<boolean>) => {
            state.isOwner = action.payload
        },
    },
    extraReducers: builder => {
        builder.addCase(addServer.fulfilled, (state, action) => {
            const server = action.payload;
            if (server && state.serverList.findIndex(e => e.address === server.address) === -1) {
                state.serverList.push(server)
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

export const { setCurrentServer, setIsOwner } = serverSlice.actions

export default serverSlice.reducer