import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MetaMaskState } from "./state";

const initialState: MetaMaskState = {
  account: "",
  chainId: 0,
  token: 0,
  isLoading: false,
};

export const metaMaskSlice = createSlice({
  name: "metamask",
  initialState,
  reducers: {
    getAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    getChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    getToken: (state, action: PayloadAction<number>) => {
      state.token = action.payload;
    },
    getMetaMask: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
  },
});

export const { getAccount, getChainId, getToken, getMetaMask } = metaMaskSlice.actions;
