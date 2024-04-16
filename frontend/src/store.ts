import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import serverSlice from "./features/serverBar/serverSlice";
import accountSlice from "./components/accountSlice";
const store = configureStore({
    reducer: {
        account: accountSlice,
        counter: counterReducer,
        server: serverSlice
    },
})
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;