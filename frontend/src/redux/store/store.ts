import { configureStore } from "@reduxjs/toolkit";
import { emptyApi } from "../api";
import { authSlice } from "../auth/slice";
import { metaMaskSlice } from "../metaMask/slice";
import { newsApi } from "../news/api";
import { portfolioSlice } from "../portfolio/slice";
import { screenerSlice } from "../screener/slice";
import { themeSlice } from "../theme/slice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [emptyApi.reducerPath]: emptyApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    screener: screenerSlice.reducer,
    theme: themeSlice.reducer,
    metaMask: metaMaskSlice.reducer,
    portfolio: portfolioSlice.reducer,
  },
  middleware: (getMiddleware) => getMiddleware().concat(emptyApi.middleware, newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type RootDispatch = any;
