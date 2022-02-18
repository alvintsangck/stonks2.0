import { combineReducers } from "redux";
import { authReducer } from "../auth/reducer";
import { RootAction } from "./action";
import { RootState } from "./state";
import { history } from "./history";
import { connectRouter } from "connected-react-router";

export const rootReducer = combineReducers<RootState, RootAction>({
	auth: authReducer,
	router: connectRouter(history),
});
