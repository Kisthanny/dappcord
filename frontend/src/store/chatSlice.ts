import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface ChatState {
    roomId: string
}

const initialState: ChatState = {
    roomId: "",
}

export const chatSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setChatRoomId: (state, action: PayloadAction<string>) => {
            state.roomId = action.payload;
        },
    }
})

export const { setChatRoomId } = chatSlice.actions

export default chatSlice.reducer