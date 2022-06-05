import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../auth/slice";

import { stockReducer } from "../stock/reducer";
import { watchlistReducer } from "../watchlist/reducer";
import { themeSlice } from "../theme/slice";
import { metaMaskSlice } from "../metaMask/slice";
import { newsApi } from "../news/api";
import { emptyApi } from "../api";
import { portfolioSlice } from "../portfolio/slice";
import { screenerSlice } from "../screener/slice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [emptyApi.reducerPath]: emptyApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    screener: screenerSlice.reducer,
    stock: stockReducer,
    theme: themeSlice.reducer,
    metaMask: metaMaskSlice.reducer,
    watchlist: watchlistReducer,
    portfolio: portfolioSlice.reducer,
  },
  middleware: (getMiddleware) => getMiddleware().concat(emptyApi.middleware, newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type RootDispatch = any;
