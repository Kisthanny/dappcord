import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface ChatState {
    roomId: string;
    loading: boolean;
}

const initialState: ChatState = {
    roomId: "",
    loading: false,
}

export const chatSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setChatRoomId: (state, action: PayloadAction<string>) => {
            state.roomId = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    }
})

export const { setChatRoomId, setLoading } = chatSlice.actions

export default chatSlice.reducer