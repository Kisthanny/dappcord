import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Channel, getServerContract } from "../libs";
interface ChannelState {
    currentChannel: Channel | null,
    userHasJoined: Boolean
}

const initialState: ChannelState = {
    currentChannel: null,
    userHasJoined: false,
}

export const setUserHasJoined = createAsyncThunk(
    'channel/setUserHasJoined',
    async ({ serverAddress, channelId, userAddress }: { serverAddress: string; channelId: string; userAddress: string }) => {
        const serverContract = await getServerContract(serverAddress);
        const hasJoined = await serverContract.hasJoined(channelId, userAddress)
        return hasJoined
    }
)

export const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setCurrentChannel: (state, action: PayloadAction<Channel>) => {
            state.currentChannel = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(setUserHasJoined.fulfilled, (state, action) => {
            state.userHasJoined = action.payload
        })
    }
})

export const { setCurrentChannel } = channelSlice.actions

export default channelSlice.reducer