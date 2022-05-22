import { AuthState, Balance, JWTPayload, User } from "./state";
import jwtDecode from "jwt-decode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./api";

function getUser(token: string | null): User | null {
  if (!token) return null;
  try {
    const payload: JWTPayload = jwtDecode(token);
    return { payload, token };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: getUser(token),
  balance: { deposit: 0, cash: 0 },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    getBalance: (state, action: PayloadAction<Balance>) => {
      state.balance.cash = action.payload.cash;
      state.balance.deposit = action.payload.deposit;
    },
    getCash: (state, action: PayloadAction<number>) => {
      state.balance.cash = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = getUser(payload);
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        state.user = getUser(payload);
      })
      .addMatcher(authApi.endpoints.loginFacebook.matchFulfilled, (state, { payload }) => {
        state.user = getUser(payload);
      })
      .addMatcher(authApi.endpoints.getBalance.matchFulfilled, (state, { payload }) => {
        state.balance.deposit = payload.deposit;
        state.balance.cash = payload.cash;
      });
  },
});

export const { logout, getBalance, getCash } = authSlice.actions;
