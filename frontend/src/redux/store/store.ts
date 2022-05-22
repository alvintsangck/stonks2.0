import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../auth/slice";
import { portfolioReducer } from "../portfolio/reducer";
import { screenerReducer } from "../screener/reducer";
import { stockReducer } from "../stock/reducer";
import { watchlistReducer } from "../watchlist/reducer";
import { themeSlice } from "../theme/slice";
import { metaMaskSlice } from "../metaMask/slice";
import { newsApi } from "../news/api";
import { emptyApi } from "../api";
import { calendarApi } from "../calendar/api";

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		[emptyApi.reducerPath]: emptyApi.reducer,
		[newsApi.reducerPath]: newsApi.reducer,
		screener: screenerReducer,
		stock: stockReducer,
		theme: themeSlice.reducer,
		metaMask: metaMaskSlice.reducer,
		watchlist: watchlistReducer,
		portfolio: portfolioReducer,
		[calendarApi.reducerPath]: calendarApi.reducer,
	},
	middleware: (getMiddleware) => getMiddleware().concat(emptyApi.middleware, newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
