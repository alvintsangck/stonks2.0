import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import { authApiFailedAction, loginAction, logoutAction, registerAction } from "./action";

export function loginThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/login", "POST");
		if ("error" in result) {
			dispatch(authApiFailedAction("log in", result.error));
		} else {
			dispatch(loginAction());
		}
	};
}

export function logoutThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/logout", "GET");
		if ("error" in result) {
			dispatch(authApiFailedAction("log out", result.error));
		} else {
			dispatch(logoutAction());
		}
	};
}

export function registerThunk() {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/register", "POST");
		if ("error" in result) {
			dispatch(authApiFailedAction("log in", result.error));
		} else {
			dispatch(registerAction());
		}
	};
}
