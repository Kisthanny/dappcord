import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: 'account',
    initialState: {
        currentAddress: '0x',
    },
    reducers: {
        setCurrentAddress: (state, action: PayloadAction<string>) => {
            state.currentAddress = action.payload
        }
    }
})

export const { setCurrentAddress } = accountSlice.actions

export default accountSlice.reducer