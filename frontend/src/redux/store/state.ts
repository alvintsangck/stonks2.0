import { RouterState } from "connected-react-router";
import { AuthState } from "../auth/state";

export type RootState = {
	auth: AuthState;
	router: RouterState;
};
