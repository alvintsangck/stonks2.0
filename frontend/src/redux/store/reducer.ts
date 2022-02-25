import { combineReducers } from "redux";
import { authReducer } from "../auth/reducer";
import { RootState } from "./state";
import { history } from "./history";
import { connectRouter } from "connected-react-router";
import { themeReducer } from "../theme/reducer";
import { portfolioReducer } from "../portfolio/reducer";

export const rootReducer = combineReducers<RootState>({
	auth: authReducer,
	theme: themeReducer,
	router: connectRouter(history),
	portfolio: portfolioReducer,
});
