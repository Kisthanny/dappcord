import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BigNumberish } from "ethers";
interface ChannelState {
    currentChannel: BigNumberish,
}

const initialState: ChannelState = {
    currentChannel: 0
}

export const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setCurrentChannel: (state, action: PayloadAction<BigNumberish>) => {
            state.currentChannel = action.payload;
        },
    },
})

export const { setCurrentChannel } = channelSlice.actions

export default channelSlice.reducer