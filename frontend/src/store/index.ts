import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import serverSlice from "./serverSlice";
import accountSlice from "./accountSlice";
import channelSlice from "./channelSlice";

const store = configureStore({
    reducer: {
        account: accountSlice,
        server: serverSlice,
        channel: channelSlice
    },
})
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>