import { combineReducers } from "redux";
import { authReducer } from "../auth/reducer";
import { RootState } from "./state";
import { history } from "./history";
import { connectRouter } from "connected-react-router";
import { themeReducer } from "../theme/reducer";
import { portfolioReducer } from "../portfolio/reducer";
import { watchlistReducer } from "../watchlist/reducer";
import { newsReducer } from "../news/reducer";
import { screenerReducer } from "../screener/reducer";

export const rootReducer = combineReducers<RootState>({
	auth: authReducer,
	news: newsReducer,
	screener: screenerReducer,
	theme: themeReducer,
	watchlist: watchlistReducer,
	portfolio: portfolioReducer,
	router: connectRouter(history),
});
