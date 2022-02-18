import { AuthAction } from "./action";
import { AuthState } from "./state";

const initialState = {
	username: "",
	password: "",
	error: null,
};

export function authReducer(state: AuthState = initialState, action: AuthAction) {
	switch (action.type) {
		case "@@Auth/login":
			return { ...state, error: null };
		case "@@Auth/logout":
			return { ...state, error: null };
		case "@@Auth/register":
			return { ...state, error: null };
		case "@@Auth/apiFailed":
			return { ...state, error: action };
		default:
			return { ...state, error: null };
	}
}
