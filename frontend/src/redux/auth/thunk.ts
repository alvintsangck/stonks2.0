import { push } from "connected-react-router";
import { LoginFormState } from "../../components/LoginForm";
import { callApi } from "../api";
import { RootDispatch } from "../store/action";
import { authApiFailedAction, loginAction, logoutAction, registerAction } from "./action";

export function loginThunk(data: LoginFormState, pathname: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/login", "POST", data);
		if ("error" in result) {
			dispatch(authApiFailedAction(result.error));
		} else {
			const { token } = result;
			localStorage.setItem("token", token);
			dispatch(loginAction(token));
			dispatch(push(pathname));
		}
	};
}

export function logoutThunk() {
	return (dispatch: RootDispatch) => {
		localStorage.removeItem("token");
		dispatch(logoutAction());
		dispatch(push("/"));
	};
}

export function registerThunk(data: any, pathname: string) {
	return async (dispatch: RootDispatch) => {
		const result = await callApi("/user/register", "POST", data);
		if ("error" in result) {
			dispatch(authApiFailedAction(result.error));
		} else {
			const { token } = result;
			localStorage.setItem("token", token);
			dispatch(registerAction(token));
			dispatch(push(pathname));
		}
	};
}
