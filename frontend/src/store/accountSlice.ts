import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSigner } from "../features/serverBar/libs";
import { ethers } from "ethers";

interface AccountState {
    currentSigner: ethers.JsonRpcSigner | null
}

const initialState: AccountState = {
    currentSigner: null
}

export const setCurrentSigner = createAsyncThunk(
    'account/setCurrentSigner',
    async () => {
        const signer = await getSigner();
        return signer;
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(setCurrentSigner.fulfilled, (state, action) => {
            state.currentSigner = action.payload
        })
    }
})

export default accountSlice.reducer