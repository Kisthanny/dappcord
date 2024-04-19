import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSigner } from "../libs";

interface AccountState {
    currentWalletAddress: string
}

const initialState: AccountState = {
    currentWalletAddress: ''
}

export const setCurrentSigner = createAsyncThunk(
    'account/setCurrentSigner',
    async () => {
        const signer = await getSigner();
        return signer.address;
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(setCurrentSigner.fulfilled, (state, action) => {
            state.currentWalletAddress = action.payload
        })
    }
})

export default accountSlice.reducer