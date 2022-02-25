import { combineReducers } from "redux";
import { authReducer } from "../auth/reducer";
import { RootState } from "./state";
import { history } from "./history";
import { connectRouter } from "connected-react-router";
import { themeReducer } from "../theme/reducer";

export const rootReducer = combineReducers<RootState>({
	auth: authReducer,
	theme: themeReducer,
	router: connectRouter(history),
});
