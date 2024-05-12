import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import serverSlice from "./serverSlice";
import accountSlice from "./accountSlice";
import channelSlice from "./channelSlice";
import chatSlice from "./chatSlice";

const store = configureStore({
    reducer: {
        account: accountSlice,
        server: serverSlice,
        channel: channelSlice,
        chat: chatSlice,
    },
})
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>